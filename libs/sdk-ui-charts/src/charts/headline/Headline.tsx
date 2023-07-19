// (C) 2007-2022 GoodData Corporation
import React, { useEffect, useState } from "react";
import { IPreparedExecution } from "@gooddata/sdk-backend-spi";
import {
    IBucket,
    IMeasure,
    INullableFilter,
    MeasureGroupIdentifier,
    newBucket,
    newDimension,
} from "@gooddata/sdk-model";
import {
    BucketNames,
    Subtract,
    useResolveValuesWithPlaceholders,
    withContexts,
    MeasureOrPlaceholder,
    NullableFiltersOrPlaceholders,
} from "@gooddata/sdk-ui";
import omit from "lodash/omit.js";
import { invariant } from "ts-invariant";

import { IBucketChartProps, ICoreChartProps } from "../../interfaces/index.js";
import { CoreHeadline, ICoreHeadlineProps } from "./CoreHeadline.js";

//
// Public interface
//

/**
 * @public
 */
export interface IHeadlineBucketProps {
    /**
     * Specify the measure whose value will be shown as the headline.
     */
    primaryMeasure: MeasureOrPlaceholder;

    /**
     * Specify secondary measure whose value will be shown for comparison with the primary measure.
     * The change in percent between the two values will also be calculated and displayed.
     *
     * @deprecated this property is deprecated, use secondaryMeasures instead
     */
    secondaryMeasure?: MeasureOrPlaceholder;

    /**
     * Specify secondary measures whose values will be shown for comparison with the primary measure.
     */
    secondaryMeasures?: MeasureOrPlaceholder[];

    /**
     * Specify filters to apply on the data to chart.
     */
    filters?: NullableFiltersOrPlaceholders;

    /**
     * Resolution context for composed placeholders.
     */
    placeholdersResolutionContext?: any;
}

/**
 * @public
 */
export interface IHeadlineProps extends IBucketChartProps, IHeadlineBucketProps {}

const WrappedHeadline = withContexts(RenderHeadline);

/**
 * Headline shows a single number or compares two numbers. You can display both measures and attributes.
 *
 * @remarks
 * Headlines have two sections: Measure (primary) and Measure (secondary).
 * You can add one item to each section. If you add two items, the headline also displays the change in percent.
 *
 * See {@link IHeadlineProps} to learn how to configure the Headline and the
 * {@link https://sdk.gooddata.com/gooddata-ui/docs/headline_component.html | headline documentation} for more information.
 *
 * @public
 */
export const Headline = (props: IHeadlineProps) => {
    const [primaryMeasure, secondaryMeasure, filters] = useResolveValuesWithPlaceholders(
        [props.primaryMeasure, props.secondaryMeasure, props.filters],
        props.placeholdersResolutionContext,
    );

    return <WrappedHeadline {...props} {...{ primaryMeasure, secondaryMeasure, filters }} />;
};

export function RenderHeadline(props: IHeadlineProps): JSX.Element {
    const { backend, workspace, primaryMeasure } = props;
    const [isEnableNewHeadline, setEnableNewHeadline] = useState<boolean>();

    useEffect(() => {
        invariant(primaryMeasure, "The property primaryMeasure must be specified.");
    }, [primaryMeasure]);

    // TODO - this block should be removed when removing FF enableNewHeadline.
    useEffect(() => {
        if (backend && workspace) {
            backend
                .workspace(workspace)
                .settings()
                .getSettingsForCurrentUser()
                .then((featureFlags) => {
                    // the logical or '!!' operator using to ensure
                    // that the isEnableNewHeadline variable is either true or false ( not undefined or null )
                    setEnableNewHeadline(!!featureFlags.enableNewHeadline);
                });
        }
    }, [backend, workspace]);

    return isEnableNewHeadline !== undefined
        ? <CoreHeadline {...toCoreHeadlineProps(props, isEnableNewHeadline)} />
        : null;
}

//
// Internals
//

type IIrrelevantHeadlineProps = IHeadlineBucketProps & IBucketChartProps;
type IHeadlineNonBucketProps = Subtract<IHeadlineProps, IIrrelevantHeadlineProps>;
type CoreHeadlineProps = ICoreChartProps & ICoreHeadlineProps;

export function toCoreHeadlineProps(props: IHeadlineProps, enableNewHeadline: boolean): CoreHeadlineProps {
    const primaryMeasure = props.primaryMeasure as IMeasure;
    const secondaryMeasures = [props.secondaryMeasure, ...(props.secondaryMeasures || [])] as IMeasure[];

    const buckets = [
        newBucket(BucketNames.MEASURES, primaryMeasure),
        newBucket(BucketNames.SECONDARY_MEASURES, ...secondaryMeasures),
    ];

    const newProps: IHeadlineNonBucketProps = omit<IHeadlineProps, keyof IIrrelevantHeadlineProps>(props, [
        "primaryMeasure",
        "secondaryMeasure",
        "filters",
        "backend",
    ]);

    return {
        ...newProps,
        enableNewHeadline,
        buckets,
        execution: createExecution(buckets, props),
        exportTitle: props.exportTitle || "Headline",
    };
}

function createExecution(buckets: IBucket[], props: IHeadlineProps): IPreparedExecution {
    const { backend, workspace, execConfig } = props;

    return backend
        .withTelemetry("Headline", props)
        .workspace(workspace)
        .execution()
        .forBuckets(buckets, props.filters as INullableFilter[])
        .withDimensions(newDimension([MeasureGroupIdentifier]))
        .withExecConfig(execConfig);
}
