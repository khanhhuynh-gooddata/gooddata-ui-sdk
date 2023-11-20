// (C) 2023 GoodData Corporation

import React from "react";
import { ICatalogAttributeHierarchy } from "@gooddata/sdk-model";
import { DropdownList } from "@gooddata/sdk-ui-kit";

import { AttributeHierarchyListItem } from "./AttributeHierarchyListItem.js";
import AttributeHierarchyListFooter from "./AttributeHierarchyListFooter.js";

/**
 * @internal
 */
export interface IAttributeHierarchyListProps {
    onSelect: (selectedDashboard: ICatalogAttributeHierarchy) => void;
    onOpenAttributeHierarchyDialog: (attributeHierarchy?: ICatalogAttributeHierarchy) => void;
    closeDropdown: () => void;
    hierarchies: ICatalogAttributeHierarchy[];
}

const ITEM_HEIGHT = 28;
const DROPDOWN_BODY_WIDTH = 187;
export const AttributeHierarchyList: React.FC<IAttributeHierarchyListProps> = ({ hierarchies, closeDropdown, onOpenAttributeHierarchyDialog, onSelect }) => {
    const handleFooterButtonClick = () => {
        onOpenAttributeHierarchyDialog();
        closeDropdown();
    }

    return (
        <DropdownList
            className="hierarchies-dropdown-body s-hierarchies-dropdown-body"
            width={DROPDOWN_BODY_WIDTH}
            itemHeight={ITEM_HEIGHT}
            showSearch={false}
            items={hierarchies}
            footer={() => (
                <AttributeHierarchyListFooter onClick={handleFooterButtonClick} />
            )}
            renderItem={({ item }) => {
                return (
                    <AttributeHierarchyListItem
                        item={item}
                        onEdit={onOpenAttributeHierarchyDialog}
                        onClick={() => {
                            onSelect(item);
                        }}
                    />
                );
            }}
        />
    );
};
