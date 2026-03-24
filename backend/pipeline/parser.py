import re
import json

def extract_course_ids(text):
    matches = re.findall(r"[A-Z]+[\s\u00a0]\d+", text)
    return [m.replace("\u00a0", " ") for m in matches]

def determine_operator(text):
    text_lower = text.lower()
    if " or " in text_lower:
        return "OR"
    return "AND"

def parse_prereqs(prereq_raw):
    # Category 3 - empty
    if not prereq_raw:
        return None
    
    courses = extract_course_ids(prereq_raw)
    
    # Category 2 - no course IDs found
    if not courses:
        return {
            "type": "text",
            "value": prereq_raw,
            "has_courses": False
        }
    
    # Category 1 - has course IDs
    operator = determine_operator(prereq_raw)
    return {
        "type": "courses",
        "operator": operator,
        "courses": courses,
        "has_courses": True
    }

test_cases = [
    "Grade of C or better in CS\u00a0211 and Grade of C or better in CS\u00a0251.",
    "Grade of C or better in MCS\u00a0360; or Grade of C or better in CS\u00a0251.",
    "CS\u00a0342.",
    "Consent of the instructor.",
    "Junior standing.",
    ""
]

for t in test_cases:
    print(parse_prereqs(t))
    print()

# load courses
with open("courses.json", "r") as f:
    courses = json.load(f)

# parse every course
for course_id, data in courses.items():
    prereq_raw = data.get("prerequisites", "")
    data["prereq_parsed"] = parse_prereqs(prereq_raw)

# save back to courses.json
with open("courses.json", "w") as f:
    json.dump(courses, f, indent=2)

print(f"Done: Parsed {len(courses)} courses.")