export class State {

    constructor(
        public id: number,
        public name: string,
        // we dont define any field corresponding to country_id column present in state table as that column is foreighn key and is used to link styate table with country table. That relationship is already handeled in spring boot app using @ManyToOne annotation, here in front end, we dont need to esatblish that relationship, hence we declare thgose fileds that exclusive to state only(ie id and name). The relationship is already handeled in backend.
    ) {

    }
}
