import { ActionStatus, TreatmentSet, StatusCheckSet } from "./definitions"

interface PatientObject {
    id?: string;
    name?: string;
    phone?: string;
    treatment_type?: TreatmentSet;
    status?: ActionStatus;
    checked?: boolean;
    tag?: string;
}

const DefaultPatientObject: PatientObject = {
    id: "",
    name: "",
    phone: "",
    treatment_type: TreatmentSet.HOME_CHECKUP,
    status: {
        status: StatusCheckSet.UNCHECKED,
        value: []
    },
    checked: true,
    tag: ""
}

class Patient {
    patient: PatientObject;
    constructor(patient: PatientObject) {
        this.patient = { ...DefaultPatientObject, ...patient };
    }

    get() {
        return this.patient;
    }

    set(patient: PatientObject) {
        this.patient = { ...this.patient, ...patient };
    }

    setStatus(status: ActionStatus) {
        this.patient.status = status;
    }
}

export default Patient;