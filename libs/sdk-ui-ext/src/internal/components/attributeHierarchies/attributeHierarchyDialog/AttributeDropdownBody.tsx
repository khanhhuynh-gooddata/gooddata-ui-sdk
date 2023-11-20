// (C) 2023 GoodData Corporation
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { DropdownList, SingleSelectListItem, ITab } from "@gooddata/sdk-ui-kit";

import { messages } from "@gooddata/sdk-ui";
import { useAttributeHierarchyDialog } from "./AttributeHierarchyDialogProvider.js";
import { CatalogAttributeDataType, EmptyParamCallback, ICatalogAttributeData } from "./types.js";

const DEFAULT_DROPDOWN_WIDTH = 253;
const DEFAULT_DROPDOWN_HEIGHT = 84;

interface IAttributeDropdownBodyProps {
    rowIndex: number;
    closeDropdown: EmptyParamCallback;
}

const TABS: ITab[] = [
    {
        id: CatalogAttributeDataType.ATTRIBUTE,
        iconOnly: true,
        icon: "gd-icon-attribute",
    },
    {
        id: CatalogAttributeDataType.DATE_ATTRIBUTE,
        iconOnly: true,
        icon: "gd-icon-date",
    },
];

const AttributeDropdownBody: React.FC<IAttributeDropdownBodyProps> = ({ rowIndex, closeDropdown }) => {
    const { formatMessage } = useIntl();
    const { getValidAttributes, onCompleteAttribute } = useAttributeHierarchyDialog();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<ICatalogAttributeData[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>(CatalogAttributeDataType.ATTRIBUTE);
    const [searchString, setSearchString] = useState<string>("");

    const displayItems: ICatalogAttributeData[] = items.filter((item) => item.type === selectedTab);

    const handleSelect = (selectedItem: ICatalogAttributeData) => {
        onCompleteAttribute(selectedItem, rowIndex);
    };

    const handleTabSelect = (tab: ITab) => {
        setSelectedTab(tab.id);
    };

    const handleSearch = (value: string) => {
        setSearchString(value);
        const newItems = items.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setItems(newItems);
    };

    useEffect(() => {
        getValidAttributes(rowIndex).then((attributes) => {
            setItems(attributes);
            setLoading(false);
        });
    }, [getValidAttributes, rowIndex]);

    const searchPlaceholderText = formatMessage(messages.hierarchyAttributeSearch);

    return (
        <DropdownList
            className="attribute-hierarchy-attribute-dropdown-body s-attribute-hierarchy-attribute-dropdown-body"
            tabsClassName="attribute-hierarchy-attribute-dropdown-tabs s-attribute-hierarchy-attribute-dropdown-tabs"
            width={DEFAULT_DROPDOWN_WIDTH}
            height={DEFAULT_DROPDOWN_HEIGHT}
            showSearch={true}
            searchPlaceholder={searchPlaceholderText}
            searchString={searchString}
            onSearch={handleSearch}
            items={displayItems}
            itemsCount={displayItems.length}
            showTabs={true}
            tabs={TABS}
            onTabSelect={handleTabSelect}
            selectedTabId={selectedTab}
            isLoading={isLoading}
            renderItem={({ item }) => {
                const handleClick = () => {
                    closeDropdown();
                    handleSelect(item);
                };

                return (
                    <SingleSelectListItem
                        className="attribute-heirarchy-attribute-dropdown-item s-attribute-heirarchy-attribute-dropdown-item"
                        title={item.title}
                        onClick={handleClick}
                        icon={item.icon}
                    />
                );
            }}
        />
    );
};

export default AttributeDropdownBody;
