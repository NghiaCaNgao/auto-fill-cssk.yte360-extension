import Utils from "./utils";

enum ORDER_BY {
    LAST_CHECKUP = "thoigian_khaibao_gannhat",
    DECLARE = "thoigian_khaibao",
    CHECKUP = "ngay_kham",
};

enum DIRECTION {
    ASC = "asc",
    DESC = "desc"
};

interface FilterObject {
    phone?: string,
    name?: string,
    address?: string,
    treatment_day?: number,
    from?: number,
    to?: number,
    medical_station_id?: string,
    wards_id?: string,
    was_deleted?: boolean,
    patient_id?: string,
    token?: string
}

const DefaultFilterObject: FilterObject = {
    phone: '',
    name: '',
    address: '',
    treatment_day: 0,
    from: 0,
    to: 0,
    medical_station_id: "",
    wards_id: "",
    was_deleted: false,
    patient_id: "",
    token: ""
};


class Filter {
    filter: FilterObject;

    constructor(filter?: FilterObject) {
        this.filter = { ...DefaultFilterObject, ...filter };
    }

    static load(): Filter {
        const textJson = localStorage.getItem('filter');
        const data = JSON.parse(textJson);
        return new Filter({
            phone: data.phone,
            name: data.name,
            address: data.address,
            treatment_day: data.treatment_day,
            from: data.from,
            to: data.to           
        });
    }

    get(): FilterObject {
        return this.filter;
    }

    set(filter: FilterObject) {
        this.filter = { ...this.filter, ...filter };
    }

    toJson(): string {
        return JSON.stringify(this.filter);
    }

    save(): void {
        //TODO: save filter
    }

    createQueryString(order_by: ORDER_BY, direction: DIRECTION): object {
        const filterRequest = [];
        const filter = this.filter;

        const alias = {
            phone: "so_dien_thoai",
            name: "tenkhongdau",
            treatment_day: "ngay_benh_thu",
            medical_station: "donvi_id",
            wards_id: "xaphuong_id",
            was_deleted: "deleted",
            patient_id: "nguoidan_id"
        }

        for (let key in filter) {
            if (alias[key]) {
                let obj = {};
                if (typeof (filter[key]) === 'string' && filter[key].trim() !== "")
                    obj[alias[key]] = { $eq: Utils.removeAccents(filter[key]).trim() };
                else if (typeof (filter[key]) !== 'string')
                    obj[alias[key]] = { $eq: filter[key] };
                filterRequest.push(obj);
            }
        }

        return {
            filters: { $and: filterRequest },
            order_by: [{
                field: order_by,
                direction: direction
            }]
        }
    }
}

export default Filter;
export { ORDER_BY, DIRECTION, FilterObject };