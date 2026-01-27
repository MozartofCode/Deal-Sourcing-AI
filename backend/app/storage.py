import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

DATA_DIR = Path(__file__).parent.parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

PROFILES_FILE = DATA_DIR / "profiles.json"
REPORTS_FILE = DATA_DIR / "reports.json"

def load_json(file_path: Path, default: Any) -> Any:
    if not file_path.exists():
        return default
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception:
        return default

def save_json(file_path: Path, data: Any):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2, default=str)

def get_profile() -> Optional[Dict]:
    """Get the single profile (since we are single user/guest mode)"""
    profiles = load_json(PROFILES_FILE, {})
    return profiles.get("current")

def save_profile(profile_data: Dict):
    profiles = load_json(PROFILES_FILE, {})
    profiles["current"] = profile_data
    save_json(PROFILES_FILE, profiles)

def get_reports() -> List[Dict]:
    return load_json(REPORTS_FILE, [])

def save_report(report: Dict):
    reports = get_reports()
    # Add to beginning
    reports.insert(0, report)
    save_json(REPORTS_FILE, reports)
