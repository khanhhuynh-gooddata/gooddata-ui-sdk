// (C) 2023 GoodData Corporation
import React, { useMemo } from "react";
import { ICoreChartProps } from "../../interfaces/index.js";
import { IBucket } from "@gooddata/sdk-model";
import { createHeadlineProvider } from "./internal/HeadlineProviderFactory.js";
import { HeadlineWithEntireDataView } from "./internal/HeadlineWithEntireDataView.js";

/**
 * @internal
 */
interface ICoreHeadlineProps {
    enableNewHeadline: boolean;
    buckets: IBucket[];
}

/**
 * @internal
 */
const CoreHeadline: React.FC<ICoreChartProps & ICoreHeadlineProps> = (props) => {
    const { buckets, enableNewHeadline, ...headlineProps } = props;
    const { config } = headlineProps;

    const provider = useMemo(() => {
        return enableNewHeadline ? createHeadlineProvider(buckets, config) : null;
    }, [buckets, config, enableNewHeadline]);

    const headlineTransformation = useMemo(() => provider?.getHeadlineTransformationComponent(), [provider]);

    return <HeadlineWithEntireDataView {...headlineProps} headlineTransformation={headlineTransformation} />;
};

/**
 * NOTE: exported to satisfy sdk-ui-ext; is internal, must not be used outside of SDK; will disappear.
 *
 * @internal
 */
export { CoreHeadline, ICoreHeadlineProps };
