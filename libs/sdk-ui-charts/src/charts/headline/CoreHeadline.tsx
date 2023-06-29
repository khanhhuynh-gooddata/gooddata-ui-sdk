// (C) 2007-2022 GoodData Corporation
import React from "react";
import noop from "lodash/noop.js";
import {
    newErrorMapping,
    IErrorDescriptors,
    IntlWrapper,
    ErrorCodes,
    ILoadingInjectedProps,
    withEntireDataView,
    ITranslationsComponentProps,
    IntlTranslationsProvider,
    ChartType,
    VisualizationTypes,
} from "@gooddata/sdk-ui";
import { ICoreChartProps } from "../../interfaces/index.js";
import HeadlineTransformation from "./internal/HeadlineTransformation.js";
import { defaultCoreChartProps } from "../_commons/defaultProps.js";
import { ChartTransformation } from "../../highcharts/index.js";

type Props = ICoreChartProps & ILoadingInjectedProps & {
    subVisType?: ChartType;
};

export class HeadlineStateless extends React.Component<Props> {
    public static defaultProps = defaultCoreChartProps;

    private errorMap: IErrorDescriptors;

    constructor(props: Props) {
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
        const { afterRender, subVisType, drillableItems, locale, dataView, onDrill, config, pushData, width } =
            this.props;
        const fullConfig = {
            ...config,
            type: subVisType,
        };
        const height = subVisType === VisualizationTypes.BAR ? 50 : 500;

        return (
            <IntlWrapper locale={locale}>
                <div className="headline-wrapper">
                    <HeadlineTransformation
                        dataView={dataView}
                        onAfterRender={afterRender}
                        onDrill={onDrill}
                        drillableItems={drillableItems}
                        config={config}
                    />
                    <IntlTranslationsProvider>
                        {(translationProps: ITranslationsComponentProps) => {
                            return (
                                <ChartTransformation
                                    height={height}
                                    width={width}
                                    config={fullConfig}
                                    drillableItems={drillableItems}
                                    locale={locale}
                                    dataView={dataView}
                                    afterRender={afterRender}
                                    onDrill={onDrill}
                                    onDataTooLarge={noop}
                                    onNegativeValues={noop}
                                    onLegendReady={noop}
                                    pushData={pushData}
                                    numericSymbols={translationProps.numericSymbols}
                                />
                            );
                        }}
                    </IntlTranslationsProvider>
                </div>
            </IntlWrapper>
        );
    }
}

/**
 * NOTE: exported to satisfy sdk-ui-ext; is internal, must not be used outside of SDK; will disapppear.
 *
 * @internal
 */
export const CoreHeadline = withEntireDataView(HeadlineStateless);
