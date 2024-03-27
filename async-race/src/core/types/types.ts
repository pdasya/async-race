// eslint-disable-next-line import/no-unresolved, import/extensions
import { ICar } from '@core/types/interfaces';

type TGetCars = {
    items: ICar[];
    total: string | null;
};

export default TGetCars;
