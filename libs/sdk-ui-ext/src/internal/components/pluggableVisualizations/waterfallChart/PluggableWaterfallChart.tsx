// (C) 2019-2023 GoodData Corporation
import React from "react";
import { set } from "lodash";
import { BucketNames, VisualizationTypes } from "@gooddata/sdk-ui";
import { IExtendedReferencePoint, IReferencePoint, IVisConstruct } from "../../../interfaces/Visualization";
import cloneDeep from "lodash/cloneDeep";
import { DEFAULT_WATERFALL_UI_CONFIG, UICONFIG } from "../../../constants/uiConfig";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS } from "../../../constants/bucket";
import { getAttributeItems, getMeasureItems, setBucketTitles } from "../../../utils/bucketHelper";
import { IInsightDefinition } from "@gooddata/sdk-model";
import WaterfallChartConfigurationPanel from "../../configurationPanels/WaterfallChartConfigurationPanel";

const measuresIcon = "local:waterfall/bucket-title-measures.svg";
const viewIcon = "local:waterfall/bucket-title-view.svg";

export class PluggableWaterfallChart extends PluggableBaseChart {
    constructor(params: IVisConstruct) {
        super(params);
        this.type = VisualizationTypes.WATERFALL;
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const extendedReferencePoint: IExtendedReferencePoint = {
            ...cloneDeep(referencePoint),
            uiConfig: cloneDeep(DEFAULT_WATERFALL_UI_CONFIG),
        };

        this.updateBuckets(extendedReferencePoint);
        this.updateUI(extendedReferencePoint);

        return Promise.resolve(extendedReferencePoint);
    }

    protected updateBuckets(extendedReferencePoint: IExtendedReferencePoint): void {
        const buckets = extendedReferencePoint?.buckets ?? [];

        const viewsBy = getAttributeItems(buckets);
        const measures = getMeasureItems(buckets);
        const isMultiMeasures = measures?.length > 1;

        set(extendedReferencePoint, BUCKETS, [
            {
                localIdentifier: BucketNames.MEASURES,
                items: measures,
            },
            {
                localIdentifier: BucketNames.VIEW,
                items: isMultiMeasures ? [] : viewsBy,
            },
        ]);
    }

    private updateUI(extendedReferencePoint: IExtendedReferencePoint) {
        const buckets = extendedReferencePoint?.buckets ?? [];

        const measures = getMeasureItems(buckets);
        const isMultiMeasures = measures?.length > 1;

        set(
            extendedReferencePoint,
            [UICONFIG],
            setBucketTitles(extendedReferencePoint, this.type, this.intl),
        );
        set(extendedReferencePoint, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], measuresIcon);
        set(extendedReferencePoint, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], viewIcon);
        if (isMultiMeasures) {
            set(extendedReferencePoint, [UICONFIG, BUCKETS, BucketNames.VIEW, "enabled"], false);
            set(extendedReferencePoint, [UICONFIG, BUCKETS, BucketNames.VIEW, "itemsLimit"], 0);
        }
    }

    protected renderConfigurationPanel(insight: IInsightDefinition): void {
        const configPanelElement = this.getConfigPanelElement();

        if (configPanelElement) {
            this.renderFun(
                <WaterfallChartConfigurationPanel
                    locale={this.locale}
                    references={this.references}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    insight={insight}
                    colors={this.colors}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.getIsError()}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                    axis={this.axis}
                />,
                configPanelElement,
            );
        }
    }
}
