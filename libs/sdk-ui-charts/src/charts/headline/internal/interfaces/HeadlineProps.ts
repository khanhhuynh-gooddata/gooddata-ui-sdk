// (C) 2023 GoodData Corporation

import { IDataView } from "@gooddata/sdk-backend-spi";
import { ExplicitDrill, IDrillEventCallback } from "@gooddata/sdk-ui";
import { IChartConfig } from "../../../../interfaces/index.js";

/**
 * @internal
 */
export interface IHeadlineTransformationProps {
    dataView: IDataView;
    drillableItems?: ExplicitDrill[];
    config?: IChartConfig;
    onDrill?: IDrillEventCallback;
    onAfterRender?: () => void;
}
