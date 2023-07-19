// (C) 2023 GoodData Corporation
import React from "react";
import { IHeadlineProvider } from "../interfaces/HeadlineProvider.js";
import ComparisonTransformation from "../ComparisonTransformation.js";
import { IHeadlineTransformationProps } from "../interfaces/HeadlineProps.js";

class ComparisonProvider implements IHeadlineProvider {
    public getHeadlineTransformationComponent(): React.ComponentType<IHeadlineTransformationProps> {
        return ComparisonTransformation;
    }
}

export default ComparisonProvider;
