// (C) 2023 GoodData Corporation
import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty.js";
import {
    areObjRefsEqual,
    ICatalogAttributeHierarchy,
    isAttributeHierarchyReference,
    objRefToString,
} from "@gooddata/sdk-model";
import { Dropdown, DropdownButton } from "@gooddata/sdk-ui-kit";
import { messages } from "@gooddata/sdk-ui";
import { AttributeHierarchyDialog } from "@gooddata/sdk-ui-ext";

import { IDrillDownAttributeHierarchyConfig } from "../../../../drill/types.js";
import {
    selectIgnoredDrillDownHierarchiesByWidgetRef,
    selectCatalogAttributeHierarchies,
    useDashboardSelector,
} from "../../../../../model/index.js";
import { AttributeHierarchyList } from "./AttributeHierarchyList.js";
import EmptyAttributeHierarchyInfo from "./EmptyAttributeHierarchyInfo.js";
import { useAttributeHierarchy } from "./useAttributeHierarchy.js";

interface IDrillTargetDashboardItemProps {
    config: IDrillDownAttributeHierarchyConfig;
    onSelect: (targetItem: ICatalogAttributeHierarchy) => void;
    onDeleteInteraction: () => void;
}

const DROPDOWN_ALIGN_POINTS = [
    {
        align: "bl tl",
        offset: {
            x: 0,
            y: 4,
        },
    },
    {
        align: "tl bl",
        offset: {
            x: 0,
            y: -4,
        },
    },
];

const DrillTargetAttributeHierarchyItem: React.FC<IDrillTargetDashboardItemProps> = ({
    config,
    onSelect,
    onDeleteInteraction,
}) => {
    const intl = useIntl();
    const catalogAttributeHierarchies = useDashboardSelector(selectCatalogAttributeHierarchies);
    const ignoredDrillDownHierarchies = useDashboardSelector(
        selectIgnoredDrillDownHierarchiesByWidgetRef(config.widgetRef),
    );
    const {
        editingAttributeHierarchy,
        shouldDisplayAttributeHierarchyDialog,
        onDeleteAttributeHierarchy,
        onSaveAttributeHierarchy,
        onOpenAttributeHierarchyDialog,
        onCloseAttributeHierarchyDialog,
    } = useAttributeHierarchy({ onDeleteInteraction });

    const attributeDescriptor = config.attributes.find(
        (attr) => attr.attributeHeader.localIdentifier === config.originLocalIdentifier,
    );

    const selectedCatalogAttributeHierarchy = config.complete
        ? catalogAttributeHierarchies.find((hierarchy) =>
              areObjRefsEqual(hierarchy.attributeHierarchy.ref, config.attributeHierarchyRef),
          )
        : null;

    const existBlacklistHierarchies = catalogAttributeHierarchies.filter((hierarchy) => {
        return ignoredDrillDownHierarchies.some((ref) => {
            if (isAttributeHierarchyReference(ref)) {
                return (
                    areObjRefsEqual(ref.attributeHierarchy, hierarchy.attributeHierarchy.ref) &&
                    objRefToString(ref.label) === attributeDescriptor?.attributeHeader.identifier
                );
            } else {
                return (
                    areObjRefsEqual(ref.dateHierarchyTemplate, hierarchy.attributeHierarchy.ref) &&
                    objRefToString(ref.dateDatasetAttribute) ===
                        attributeDescriptor?.attributeHeader.identifier
                );
            }
        });
    });

    const shouldShowEmptyMessage = isEmpty(existBlacklistHierarchies) && !config.complete;
    const buttonText =
        selectedCatalogAttributeHierarchy?.attributeHierarchy.title ??
        intl.formatMessage(messages.drilldownSelectHierarchy);
    return (
        <>
            {shouldShowEmptyMessage ? (
                <EmptyAttributeHierarchyInfo onOpenAttributeHierarchyDialog={onOpenAttributeHierarchyDialog} />
            ) : (
                <Dropdown
                    className="drill-config-hierarchy-target-select s-drill-config-hierarchy-target-select"
                    closeOnMouseDrag={false}
                    closeOnParentScroll={true}
                    closeOnOutsideClick={true}
                    alignPoints={DROPDOWN_ALIGN_POINTS}
                    renderButton={({ isOpen, toggleDropdown }) => (
                        <DropdownButton
                            value={buttonText}
                            onClick={toggleDropdown}
                            isOpen={isOpen}
                            isSmall={false}
                            disabled={config.complete}
                            iconLeft={config.complete ? "gd-icon-attribute-hierarchy" : ""}
                            className="gd-button-small s-visualization-button-target-hierarchy"
                        />
                    )}
                    renderBody={({ closeDropdown }) => {
                        return (
                            <AttributeHierarchyList
                                hierarchies={existBlacklistHierarchies}
                                closeDropdown={closeDropdown}
                                onOpenAttributeHierarchyDialog={onOpenAttributeHierarchyDialog}
                                onSelect={(hierarchy) => {
                                    onSelect(hierarchy);
                                    closeDropdown();
                                }}
                            />
                        );
                    }}
                />
            )}
            {shouldDisplayAttributeHierarchyDialog ? (
                <AttributeHierarchyDialog
                    initialAttributeRef={attributeDescriptor?.attributeHeader.formOf.ref}
                    editingAttributeHierarchy={editingAttributeHierarchy}
                    onClose={onCloseAttributeHierarchyDialog}
                    onSaveOrUpdate={onSaveAttributeHierarchy}
                    onDelete={onDeleteAttributeHierarchy}
                />
            ) : null}
        </>
    );
};

export default DrillTargetAttributeHierarchyItem;
