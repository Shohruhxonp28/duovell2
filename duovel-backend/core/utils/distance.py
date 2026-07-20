import math
from datetime import datetime, timezone

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the great-circle distance between two points on the Earth
    in kilometers using the Haversine formula.
    """
    if None in (lat1, lon1, lat2, lon2):
        return 0.0

    try:
        lat1, lon1, lat2, lon2 = float(lat1), float(lon1), float(lat2), float(lon2)
    except (TypeError, ValueError):
        return 0.0

    R = 6371.0  # Earth's mean radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return round(distance, 2)


def is_place_open_now(working_hours: dict, dt: datetime = None) -> bool:
    """
    Determines whether a place is currently open based on working_hours JSON dict.
    Format example:
    {
      "mon": "09:00-22:00",
      "tue": "09:00-22:00",
      "wed": "09:00-22:00",
      "thu": "09:00-22:00",
      "fri": "09:00-22:00",
      "sat": "10:00-23:00",
      "sun": "10:00-23:00",
      "all": "24/7"
    }
    """
    if not working_hours or not isinstance(working_hours, dict):
        return True  # Default to open if no hours specified

    if dt is None:
        dt = datetime.now()

    day_key = dt.strftime('%a').lower()[:3]  # mon, tue, wed, thu, fri, sat, sun
    hours_str = working_hours.get(day_key) or working_hours.get('all') or working_hours.get('default')

    if not hours_str:
        return True

    if hours_str.strip().lower() in ['24/7', '24 hours', 'open 24 hours']:
        return True

    if hours_str.strip().lower() in ['closed', 'off']:
        return False

    try:
        if '-' in hours_str:
            open_str, close_str = hours_str.split('-')
            open_time = datetime.strptime(open_str.strip(), '%H:%M').time()
            close_time = datetime.strptime(close_str.strip(), '%H:%M').time()

            current_time = dt.time()

            if open_time <= close_time:
                return open_time <= current_time <= close_time
            else:
                # Handles overnight shifts, e.g., 20:00 - 04:00
                return current_time >= open_time or current_time <= close_time
    except Exception:
        pass

    return True
