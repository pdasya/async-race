/* eslint-disable no-unused-vars */
const enum PageIds {
    Garage = 'garage',
    Winners = 'winners',
    Default = 'current-page',
}

const enum Links {
    author = 'https://github.com/pdasya',
    course = 'https://rs.school/',
}

const enum Endpoints {
    garage = 'garage',
    winners = 'winners',
    engine = 'engine',
}

const enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

const enum Engine {
    start = 'started',
    stop = 'stopped',
    drive = 'drive',
}

const enum Defaults {
    carCount = '4',
    defaultPage = '1',
}

const enum Sort {
    id = 'id',
    wins = 'wins',
    time = 'time',
    ASC = 'ASC',
    DESC = 'DESC',
}

const enum Event {
    update = 'update',
    updateCars = 'update-cars',
    select = 'select',
    delete = 'delete',
    start = 'start',
    race = 'race',
    reset = 'reset',
    stop = 'stop',
}

const enum Pagination {
    garage = 'paginationGarage',
    winners = 'paginationWinners',
}

const enum Code {
    Success = 200,
    BadRequest = 400,
    NotFound = 404,
    TooManyRequest = 429, 
    InternalServerError = 500,
}
export { PageIds, Links, Endpoints, Methods, Engine, Defaults, Sort, Event, Pagination, Code };
