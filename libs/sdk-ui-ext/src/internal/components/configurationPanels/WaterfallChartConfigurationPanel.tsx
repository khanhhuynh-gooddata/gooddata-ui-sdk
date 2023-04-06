// (C) 2023 GoodData Corporation
import React from "react";
import BaseChartConfigurationPanel from "./BaseChartConfigurationPanel";
import { getMeasuresFromMdObject } from "../../utils/bucketHelper";
import ColorsSection from "../configurationControls/colors/ColorsSection";

export default class WaterfallChartConfigurationPanel extends BaseChartConfigurationPanel {
    protected renderColorSection(): React.ReactNode {
        const { properties, propertiesMeta, pushData, colors, featureFlags, references, insight, isLoading } =
            this.props;

        const controlsDisabled = this.isControlDisabled();
        const hasMeasures = getMeasuresFromMdObject(insight).length > 0;

        return (
            <ColorsSection
                properties={properties}
                propertiesMeta={propertiesMeta}
                references={references}
                colors={colors}
                controlsDisabled={controlsDisabled}
                pushData={pushData}
                hasMeasures={hasMeasures}
                showCustomPicker={featureFlags.enableCustomColorPicker as boolean}
                isLoading={isLoading}
            />
        );
    }
}
