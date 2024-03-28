/* eslint-disable no-shadow */
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
export { PageIds, Links, Endpoints, Methods, Engine, Defaults };
