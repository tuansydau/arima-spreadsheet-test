import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import "./index.css";

import { Univer, LocaleType } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { enUS as UniverDesignEnUS } from "@univerjs/design";
import { enUS as UniverDocsUIEnUS } from "@univerjs/docs-ui";
import { enUS as UniverSheetsEnUS } from "@univerjs/sheets";
import { enUS as UniverSheetsUIEnUS } from "@univerjs/sheets-ui";
import { enUS as UniverUIEnUS } from "@univerjs/ui";

// eslint-disable-next-line react/display-name
const UniverSheet = forwardRef(({ data }, ref) => {
  const univerRef = useRef(null);
  const workbookRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData,
  }));

  const init = (data = {}) => {
    if (!containerRef.current) {
      throw Error("container not initialized");
    }
    const univer = new Univer({
      theme: defaultTheme,
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: {
          ...UniverSheetsEnUS,
          ...UniverDocsUIEnUS,
          ...UniverSheetsUIEnUS,
          ...UniverUIEnUS,
          ...UniverDesignEnUS,
        },
      },
    });
    univerRef.current = univer;

    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
      header: false,
      toolbar: true,
      footer: false,
    });

    univer.registerPlugin(UniverDocsPlugin, {
      hasScroll: false,
    });
    univer.registerPlugin(UniverDocsUIPlugin);

    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    workbookRef.current = univer.createUniverSheet(data);
  };

  const destroyUniver = () => {
    univerRef.current?.dispose();
    univerRef.current = null;
    workbookRef.current = null;
  };

  const getData = () => {
    if (!workbookRef.current) {
      throw new Error("Workbook is not initialized");
    }
    return workbookRef.current.save();
  };

  useEffect(() => {
    init(data);
    return () => {
      destroyUniver();
    };
  }, [data]);

  return <div ref={containerRef} className="univer-container" />;
});

export default UniverSheet;
