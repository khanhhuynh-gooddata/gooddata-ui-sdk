// (C) 2023 GoodData Corporation
import React from "react";
import { IHeadlineProvider } from "../interfaces/HeadlineProvider.js";
import { IHeadlineTransformationProps } from "../interfaces/HeadlineProps.js";
import MultiMeasuresTransformation from "../MultiMeasuresTransformation.js";

class MultiMeasuresProvider implements IHeadlineProvider {
    public getHeadlineTransformationComponent(): React.ComponentType<IHeadlineTransformationProps> {
        return MultiMeasuresTransformation;
    }
}

export default MultiMeasuresProvider;
