// (C) 2023 GoodData Corporation
import { bucketMeasure, bucketMeasures, bucketsFind, IBucket, IMeasure } from "@gooddata/sdk-model";
import { IChartConfig, IComparison } from "../../../interfaces/index.js";
import { HeadlineType, IHeadlineProvider } from "./interfaces/HeadlineProvider.js";
import MultiMeasuresProvider from "./providers/MultiMeasuresProvider.js";
import ComparisonProvider from "./providers/ComparisonProvider.js";
import { BucketNames } from "@gooddata/sdk-ui";
import isEmpty from "lodash/isEmpty.js";

/**
 * @internal
 */
export const createHeadlineProvider = (buckets: IBucket[], config: IChartConfig): IHeadlineProvider => {
    const headlineType = getHeadlineType(buckets, config);
    if (headlineType === HeadlineType.COMPARISON) {
        return new ComparisonProvider();
    }

    return new MultiMeasuresProvider();
};

const getHeadlineType = (buckets: IBucket[], config: IChartConfig): HeadlineType => {
    const measureBucket = bucketsFind(buckets, BucketNames.MEASURES);
    const primaryMeasure = measureBucket && bucketMeasure(measureBucket);

    const secondaryBucket = bucketsFind(buckets, BucketNames.SECONDARY_MEASURES);
    const secondaryMeasures = !isEmpty(secondaryBucket) ? bucketMeasures(secondaryBucket) : [];

    if (isComparisonType(primaryMeasure, secondaryMeasures, config?.comparison)) {
        return HeadlineType.COMPARISON;
    }

    return HeadlineType.MULTI_MEASURES;
};

const isComparisonType = (
    primaryMeasure: IMeasure,
    secondaryMeasures: IMeasure[],
    comparison: IComparison,
): boolean => {
    return primaryMeasure && secondaryMeasures?.length === 1 && comparison?.enabled;
};
