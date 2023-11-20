// (C) 2023 GoodData Corporation
import flatMap from "lodash/flatMap.js";
import { areObjRefsEqual, ObjRef } from "@gooddata/sdk-model";
import { IWorkspaceCatalog } from "@gooddata/sdk-backend-spi";

import { CatalogAttributeDataType, ICatalogAttributeData } from "./types.js";

export const findCatalogAttributeByRef = (catalogAttributes: ICatalogAttributeData[], ref: ObjRef) => {
    return catalogAttributes.find((it) => areObjRefsEqual(it.ref, ref));
};

export const convertToCatalogAttributeData = (catalog: IWorkspaceCatalog): ICatalogAttributeData[] => {
    const attrs: ICatalogAttributeData[] = catalog.attributes().map((it) => ({
        type: CatalogAttributeDataType.ATTRIBUTE,
        ref: it.attribute.ref,
        title: it.attribute.title,
        icon: "gd-icon-attribute",
    }));
    const dateAttributes = flatMap(
        flatMap(catalog.dateDatasets(), (it) => it.dateAttributes),
        (it) => ({
            type: CatalogAttributeDataType.DATE_ATTRIBUTE,
            ref: it.attribute.ref,
            title: it.attribute.title,
            icon: "gd-icon-date",
        }),
    );

    return [...attrs, ...dateAttributes];
};
