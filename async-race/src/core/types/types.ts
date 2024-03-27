// eslint-disable-next-line import/no-unresolved, import/extensions
import { ICar } from './interfaces';

type TGetCars = {
    items: ICar[];
    total: string | null;
};

export default TGetCars;
