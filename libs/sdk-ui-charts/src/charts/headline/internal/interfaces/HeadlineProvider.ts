// (C) 2023 GoodData Corporation
import React from "react";
import { IHeadlineTransformationProps } from "./HeadlineProps.js";

export enum HeadlineType {
    MULTI_MEASURES,
    COMPARISON,
}

/**
 * @internal
 */
export interface IHeadlineProvider {
    getHeadlineTransformationComponent: () => React.ComponentType<IHeadlineTransformationProps>;
}
