import moment from 'moment-timezone';
import { lookupViaCity } from 'city-timezones';

interface BaziInput {
  birthDate: string; // "2004-04-21"
  birthTime: string; // "23:00"
  birthPlace: string; // "San Jose, CA" or "Singapore"
  gender: 'male' | 'female';
}

export class TimezoneBaziService {
  /**
   * Convert city/location to timezone
   */
  private getTimezoneFromCity(city: string): string {
    // Handle common formats
    const normalizedCity = city.toLowerCase();
    
    // Common timezone mappings for major cities
    const timezoneMap: { [key: string]: string } = {
      'san jose': 'America/Los_Angeles',
      'san francisco': 'America/Los_Angeles',
      'los angeles': 'America/Los_Angeles',
      'california': 'America/Los_Angeles',
      'new york': 'America/New_York',
      'chicago': 'America/Chicago',
      'singapore': 'Asia/Singapore',
      'beijing': 'Asia/Shanghai',
      'shanghai': 'Asia/Shanghai',
      'hong kong': 'Asia/Hong_Kong',
      'london': 'Europe/London',
      'paris': 'Europe/Paris',
      'tokyo': 'Asia/Tokyo',
    };

    // Check direct mapping first
    for (const [cityKey, timezone] of Object.entries(timezoneMap)) {
      if (normalizedCity.includes(cityKey)) {
        return timezone;
      }
    }

    // Use city-timezones package as fallback
    try {
      const cityInfo = lookupViaCity(city);
      if (cityInfo && cityInfo.length > 0) {
        return cityInfo[0].timezone;
      }
    } catch (error) {
      console.warn(`Could not find timezone for ${city}, using fallback`);
    }

    // Default fallback to UTC
    return 'UTC';
  }

  /**
   * Prepare properly timezone-adjusted datetime for BaZi calculation
   */
  public prepareBaziInput(input: BaziInput): string {
    const { birthDate, birthTime, birthPlace, gender } = input;
    
    try {
      // Get timezone for the birth location
      const timezone = this.getTimezoneFromCity(birthPlace);
      
      console.log('=== Timezone BaZi Service Debug ===');
      console.log('Birth place:', birthPlace);
      console.log('Detected timezone:', timezone);
      console.log('Birth date:', birthDate);
      console.log('Birth time:', birthTime);
      
      // Create moment object with proper timezone
      const birthMoment = moment.tz(
        `${birthDate} ${birthTime}`, 
        'YYYY-MM-DD HH:mm',
        timezone
      );
      
      console.log('Local birth moment:', birthMoment.format('YYYY-MM-DD HH:mm:ss z'));
      console.log('UTC equivalent:', birthMoment.utc().format('YYYY-MM-DD HH:mm:ss [UTC]'));
      
      // Return ISO string that represents the local time
      // We want the MCP server to use this as the actual solar time
      const localTimeAsUTC = moment.utc(`${birthDate} ${birthTime}`, 'YYYY-MM-DD HH:mm');
      const solarDatetime = localTimeAsUTC.toISOString();
      
      console.log('Solar datetime for MCP (local time as UTC):', solarDatetime);
      console.log('=====================================');
      
      return solarDatetime;
      
    } catch (error) {
      console.error('Error in timezone preprocessing:', error);
      // Fallback: use the input as-is
      const fallbackMoment = moment.utc(`${birthDate} ${birthTime}`, 'YYYY-MM-DD HH:mm');
      return fallbackMoment.toISOString();
    }
  }

  /**
   * Parse frontend datetime and extract components
   */
  public parseClientDateTime(clientDateTime: string): { date: string; time: string } {
    const moment_obj = moment(clientDateTime);
    return {
      date: moment_obj.format('YYYY-MM-DD'),
      time: moment_obj.format('HH:mm')
    };
  }
}