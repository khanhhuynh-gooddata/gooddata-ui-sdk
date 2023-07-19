// (C) 2007-2022 GoodData Corporation
import React from "react";
import {
    newErrorMapping,
    IErrorDescriptors,
    IntlWrapper,
    ErrorCodes,
    withEntireDataView,
    ILoadingInjectedProps,
} from "@gooddata/sdk-ui";
import LegacyHeadlineTransformation from "./LegacyHeadlineTransformation.js";
import { defaultCoreChartProps } from "../../_commons/defaultProps.js";
import { ICoreChartProps } from "../../../interfaces/index.js";
import { IHeadlineTransformationProps } from "./interfaces/HeadlineProps.js";

interface IHeadlineStatelessProps {
    headlineTransformation: React.ComponentType<IHeadlineTransformationProps>;
}

type CoreHeadlineProps = ICoreChartProps & ILoadingInjectedProps & IHeadlineStatelessProps;

export class HeadlineStateless extends React.Component<CoreHeadlineProps> {
    public static defaultProps = defaultCoreChartProps;

    private errorMap: IErrorDescriptors;

    constructor(props: CoreHeadlineProps) {
        super(props);
        this.errorMap = newErrorMapping(props.intl);
    }

    public render(): JSX.Element {
        const { dataView, error, isLoading } = this.props;

        const ErrorComponent = this.props.ErrorComponent;
        const LoadingComponent = this.props.LoadingComponent;

        if (error) {
            const errorProps =
                this.errorMap[
                    Object.prototype.hasOwnProperty.call(this.errorMap, error)
                        ? error
                        : ErrorCodes.UNKNOWN_ERROR
                ];
            return ErrorComponent ? <ErrorComponent code={error} {...errorProps} /> : null;
        }

        // when in pageble mode (getPage present) never show loading (its handled by the component)
        if (isLoading || !dataView) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return this.renderVisualization();
    }

    protected renderVisualization(): JSX.Element {
        const { afterRender, drillableItems, locale, dataView, onDrill, config, headlineTransformation } =
            this.props;
        const HeadlineTransformation = headlineTransformation || LegacyHeadlineTransformation;

        return (
            <IntlWrapper locale={locale}>
                <HeadlineTransformation
                    dataView={dataView}
                    onAfterRender={afterRender}
                    onDrill={onDrill}
                    drillableItems={drillableItems}
                    config={config}
                />
            </IntlWrapper>
        );
    }
}

/**
 * @internal
 */
export const HeadlineWithEntireDataView = withEntireDataView(HeadlineStateless);
