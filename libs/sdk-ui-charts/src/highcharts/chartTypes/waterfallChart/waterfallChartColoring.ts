// (C) 2023 GoodData Corporation
import {
    ColorStrategy,
    IColorMapping,
    ICreateColorAssignmentReturnValue,
} from "@gooddata/sdk-ui-vis-commons";
import { IColorPalette } from "@gooddata/sdk-model";
import { DataViewFacade, IColorAssignment, IMappingHeader } from "@gooddata/sdk-ui";

export class WaterfallChartColorStrategy extends ColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        dv: DataViewFacade,
    ): ICreateColorAssignmentReturnValue {
        const negativeMapping = colorMapping?.find((item) =>
            item.predicate(this.buildCustomHeader("Negative"), { dv }),
        );
        const negativeColor: IColorAssignment = {
            color: negativeMapping?.color ?? {
                type: "guid",
                value: colorPalette[0].guid,
            },
            headerItem: this.buildCustomHeader("Negative"),
        };

        const positiveMapping = colorMapping?.find((item) =>
            item.predicate(this.buildCustomHeader("Positive"), { dv }),
        );
        const positiveColor: IColorAssignment = {
            color: positiveMapping?.color ?? {
                type: "guid",
                value: colorPalette[1].guid,
            },
            headerItem: this.buildCustomHeader("Positive"),
        };

        const totalMapping = colorMapping?.find((item) =>
            item.predicate(this.buildCustomHeader("Sum"), { dv }),
        );
        const totalColor: IColorAssignment = {
            color: totalMapping?.color ?? {
                type: "guid",
                value: colorPalette[2].guid,
            },
            headerItem: this.buildCustomHeader("Sum"),
        };

        return {
            fullColorAssignment: [negativeColor, positiveColor, totalColor],
        };
    }

    private buildCustomHeader(name: string): IMappingHeader {
        return {
            customHeader: {
                name,
            },
        } as any as IMappingHeader;
    }
}
