// Checkup report value type
enum TreatmentSet {
    ADVISORY = 1,
    HOME_CHECKUP = 2,
    STATION_CHECKUP = 3,
    EMERGENCY = 4,
}

enum HealthStatusSet {
    STABLE = 1,
    UNSTABLE = 2,
    OTHERS = 3,
    DEAD = 4,
}

enum TestTypeSet {
    RAPID_ANTIGEN = 1,
    RT_PCR = 2,
}

enum TestResultSet {
    POSITIVE = 1,
    NEGATIVE = 2,
}

enum DiagnosisSet {
    NO_SYMPTOMS = 1,
    MILD_SYMPTOMS = 2,
    MODERATE_SYMPTOMS = 3,
    SEVERE_SYMPTOMS = 4,
    CRITICAL_SYMPTOMS = 5,
    DEAD = 6,
}

// Checking value type
enum StatusCheckSet {
    UNCHECKED = 1,
    ERROR = 2,
    DONE = 3,
    DELETED = 4,
    PASSED = 5,
}

enum CheckItemSet {
    ADVICE = "advice",
    TREATMENT_TYPE = "treatment_type",
    HEALTH_STATUS = "health_status",
    DIAGNOSIS = "diagnosis",
}

// Running value type
enum RunModeSet{
    AUTO = 1,
    ONLY_DECLARE = 2,
    ONLY_CHECKUP = 3,
    CHECKUP_DECLARE = 4,
    REMOVE_LAST_CHECKUP = 5,
    REMOVE_LAST_DECLARE = 6,
    FINISH_TREATMENT = 7,
}

enum ActionSet {
    DECLARE = "declare",
    CHECKUP = "checkup",
    FILTER = "filter",
    CURRENT_USER = "current_user",
}


interface ActionStatus {
    status: StatusCheckSet;
    value: string[];
}

export {
    TreatmentSet,
    HealthStatusSet,
    TestTypeSet,
    TestResultSet,
    DiagnosisSet,
    StatusCheckSet,
    CheckItemSet,
    RunModeSet,
    ActionSet,
    ActionStatus,
};