import React from 'react';
import './App.scss';
import './textarea.scss';
import Popup from './components/Popup/Popup';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';
import { CommandParsingService } from './services/command-parsing.service';
import { CommandTypesService } from './services/command-types.service';
import { CommandService } from './services/command.service';
import { ContextService } from './services/context.service';
import { SortService } from './services/sort.service';
import { TextUtilsService } from './services/text-utils.service';
import { CodeCompressionService } from './services/code-compression.service';
import { CamelCommand } from './services/commands/camel-command';
import { PascalCommand } from './services/commands/pascal-command';
import { KebabCommand } from './services/commands/kebab-command';
import { UpperCommand } from './services/commands/upper-command';
import { LowerCommand } from './services/commands/lower-command';
import HelpPopupContent from './components/HelpPopupContent/HelpPopupContent';
import ContextPopupContent from './components/ContextPopupContent/ContextPopupContent';
import { Context } from './interfaces/Context';
import { DistinctCommand } from './services/commands/distinct-command';

interface AppProps {
}

interface AppState {
  code: string;
  compressedCode: string;
  explanation: string;
  input: string;
  output: string[][];
  context: Context;
  topSectionHeight: number;
  codeWindowWidth: number;
  inputPaneWidth: number;
  draggedBorder: string | undefined;
  isHelpPopupVisible: boolean;
  isContextPopupVisible: boolean;
}

class App extends React.Component<AppProps, AppState> {

  inputPaneValue :string;
  codeWindowValue :string;
  textUtilsService: TextUtilsService;
  codeCompressionService: CodeCompressionService;
  contextService: ContextService;
  commandTypesService: CommandTypesService;
  commandService: CommandService;

  constructor(props: AppProps) {
    super(props)

    this.textUtilsService = new TextUtilsService();
    this.codeCompressionService = new CodeCompressionService(this.textUtilsService);
    this.contextService = new ContextService(this.textUtilsService);
    this.commandTypesService = new CommandTypesService(this.textUtilsService, new SortService(this.textUtilsService), new ContextService(this.textUtilsService), new CamelCommand(this.textUtilsService), new PascalCommand(this.textUtilsService), new KebabCommand(this.textUtilsService), new UpperCommand(this.textUtilsService), new LowerCommand(this.textUtilsService), new DistinctCommand());

    this.commandService = new CommandService(
      this.textUtilsService,
      new CommandParsingService(this.textUtilsService, this.commandTypesService), 
      this.commandTypesService, 
      new ContextService(this.textUtilsService)
    );

//     const input = `Id,AccountRef,FirstName,LastName,City,Worth
// 1,W11111,Edward,Smale,Leighton Buzzard,999.99
// 1,W11112,Edward,Smale,Sheffield,800.01
// 2,W22222,Stephen,Smale,Sheffield,700.50
// 3,W33333,Jo,Smale,Roehampton,1100.45
// 4,W44444,Jo,Burton,Barnes,1200.32
// 5,W55555,Edward,Burton,London,44.76`;

// const input = `Name VARCHAR(100) NOT NULL,
// Brand VARCHAR(100) NOT NULL,
// Colour VARCHAR(100) NULL,
// BasePrice MONEY NOT NULL,
// RRP MONEY NULL
// `;

    const input = `ReportConsole
    -------------
    [08/22/2019 12:01:19] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:01:19] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:01:19] --------------------------------------------------------------------------------
    [08/22/2019 12:01:19] No FTP host given, skipping download and extraction.
    [08/22/2019 12:01:19] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 22.255 seconds (163.230 MB/sec).
    [08/22/2019 12:01:42] Running shared patches
    [08/22/2019 12:01:43] Denormalising columns for report-console
    [08/22/2019 12:01:43] Adding functions
    [08/22/2019 12:01:43] Adding misc. indexes
    [08/22/2019 12:01:44] Patching erroneous cost prices
    [08/22/2019 12:01:44] Patching high-value uncategorised products
    [08/22/2019 12:01:44] Adding denormalised columns
    [08/22/2019 12:01:44]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:01:51]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:02:08] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:02:15]     adding denormalised columns to Despatch
    [08/22/2019 12:02:20]     adding denormalised columns to Account
    [08/22/2019 12:02:36]     adding denormalised columns to Category
    [08/22/2019 12:02:36] Adding date tables
    [08/22/2019 12:02:36]     adding date functions
    [08/22/2019 12:02:36]     Days table
    [08/22/2019 12:02:37]     Months table
    [08/22/2019 12:02:37]     Quarters table
    [08/22/2019 12:02:37] Adding lifeycle views
    [08/22/2019 12:02:37] Adding Integers table
    [08/22/2019 12:02:37] Adding indexes
    [08/22/2019 12:02:38] Running report console initialisation
    [08/22/2019 12:03:57] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:03:57] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:03:57] --------------------------------------------------------------------------------
    [08/22/2019 12:03:57] No FTP host given, skipping download and extraction.
    [08/22/2019 12:03:57] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 21.161 seconds (171.669 MB/sec).
    [08/22/2019 12:04:20] Running shared patches
    [08/22/2019 12:04:21] Denormalising columns for report-console
    [08/22/2019 12:04:21] Adding functions
    [08/22/2019 12:04:21] Adding misc. indexes
    [08/22/2019 12:04:21] Patching erroneous cost prices
    [08/22/2019 12:04:22] Patching high-value uncategorised products
    [08/22/2019 12:04:22] Adding denormalised columns
    [08/22/2019 12:04:22]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:04:29]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:04:47] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:04:55]     adding denormalised columns to Despatch
    [08/22/2019 12:04:59]     adding denormalised columns to Account
    [08/22/2019 12:05:15]     adding denormalised columns to Category
    [08/22/2019 12:05:15] Adding date tables
    [08/22/2019 12:05:15]     adding date functions
    [08/22/2019 12:05:15]     Days table
    [08/22/2019 12:05:16]     Months table
    [08/22/2019 12:05:16]     Quarters table
    [08/22/2019 12:05:16] Adding lifeycle views
    [08/22/2019 12:05:16] Adding Integers table
    [08/22/2019 12:05:17] Adding indexes
    [08/22/2019 12:05:17] Running report console initialisation
    [08/22/2019 12:11:27] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:11:27] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:11:27] --------------------------------------------------------------------------------
    [08/22/2019 12:11:27] No FTP host given, skipping download and extraction.
    [08/22/2019 12:11:27] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 20.259 seconds (179.312 MB/sec).
    [08/22/2019 12:11:49] Running shared patches
    [08/22/2019 12:11:50] Denormalising columns for report-console
    [08/22/2019 12:11:50] Adding functions
    [08/22/2019 12:11:50] Adding misc. indexes
    [08/22/2019 12:11:50] Patching erroneous cost prices
    [08/22/2019 12:11:51] Patching high-value uncategorised products
    [08/22/2019 12:11:51] Adding denormalised columns
    [08/22/2019 12:11:51]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:11:58]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:12:15] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:12:23]     adding denormalised columns to Despatch
    [08/22/2019 12:12:27]     adding denormalised columns to Account
    [08/22/2019 12:12:43]     adding denormalised columns to Category
    [08/22/2019 12:12:44] Adding date tables
    [08/22/2019 12:12:44]     adding date functions
    [08/22/2019 12:12:44]     Days table
    [08/22/2019 12:12:44]     Months table
    [08/22/2019 12:12:44]     Quarters table
    [08/22/2019 12:12:44] Adding lifeycle views
    [08/22/2019 12:12:44] Adding Integers table
    [08/22/2019 12:12:45] Adding indexes
    [08/22/2019 12:12:45] Running report console initialisation
    [08/22/2019 12:15:16] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:15:16] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:15:16] --------------------------------------------------------------------------------
    [08/22/2019 12:15:16] No FTP host given, skipping download and extraction.
    [08/22/2019 12:15:16] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 21.967 seconds (165.370 MB/sec).
    [08/22/2019 12:15:40] Running shared patches
    [08/22/2019 12:15:41] Denormalising columns for report-console
    [08/22/2019 12:15:41] Adding functions
    [08/22/2019 12:15:41] Adding misc. indexes
    [08/22/2019 12:15:41] Patching erroneous cost prices
    [08/22/2019 12:15:42] Patching high-value uncategorised products
    [08/22/2019 12:15:42] Adding denormalised columns
    [08/22/2019 12:15:42]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:15:49]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:16:06] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:16:13]     adding denormalised columns to Despatch
    [08/22/2019 12:16:17]     adding denormalised columns to Account
    [08/22/2019 12:16:33]     adding denormalised columns to Category
    [08/22/2019 12:16:33] Adding date tables
    [08/22/2019 12:16:33]     adding date functions
    [08/22/2019 12:16:33]     Days table
    [08/22/2019 12:16:34]     Months table
    [08/22/2019 12:16:34]     Quarters table
    [08/22/2019 12:16:34] Adding lifeycle views
    [08/22/2019 12:16:34] Adding Integers table
    [08/22/2019 12:16:34] Adding indexes
    [08/22/2019 12:16:35] Running report console initialisation
    [08/22/2019 12:17:00] Configuring Permissions
    [08/22/2019 12:17:00] Building Datawarehouse Tables
    [08/22/2019 12:17:01] Loading valid orders
    [08/22/2019 12:17:04] Loading valid order lines
    [08/22/2019 12:17:06] Loading active complementary products
    [08/22/2019 12:17:06] Loading products
    [08/22/2019 12:17:07] Inserting dates
    [08/22/2019 12:17:08] Loading accounts
    [08/22/2019 12:17:48] Loading add to cart tracking
    [08/22/2019 12:17:49] Loading orders
    [08/22/2019 12:17:54] Loading order lines
    Changed database context to 'PaperstoneDW'.
    [08/22/2019 12:18:05] Loading Cube
    <return xmlns="urn:schemas-microsoft-com:xml-analysis"><root xmlns="urn:schemas-microsoft-com:xml-analysis:empty"></root></return>
    <return xmlns="urn:schemas-microsoft-com:xml-analysis"><root xmlns="urn:schemas-microsoft-com:xml-analysis:empty"></root></return>
    [08/22/2019 12:18:26] Reporting load complete
    [08/22/2019 12:18:56] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:18:56] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:18:56] --------------------------------------------------------------------------------
    [08/22/2019 12:18:57] No FTP host given, skipping download and extraction.
    [08/22/2019 12:18:57] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 22.072 seconds (164.584 MB/sec).
    [08/22/2019 12:19:20] Running shared patches
    [08/22/2019 12:19:21] Denormalising columns for report console
    [08/22/2019 12:19:21] Adding functions
    [08/22/2019 12:19:21] Adding misc. indexes
    [08/22/2019 12:19:21] Patching erroneous cost prices
    [08/22/2019 12:19:22] Patching high-value uncategorised products
    [08/22/2019 12:19:22] Adding denormalised columns
    [08/22/2019 12:19:22]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:19:29]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:19:46] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:19:52]     adding denormalised columns to Despatch
    [08/22/2019 12:19:57]     adding denormalised columns to Account
    [08/22/2019 12:20:13]     adding denormalised columns to Category
    [08/22/2019 12:20:13] Adding date tables
    [08/22/2019 12:20:13]     adding date functions
    [08/22/2019 12:20:13]     Days table
    [08/22/2019 12:20:13]     Months table
    [08/22/2019 12:20:13]     Quarters table
    [08/22/2019 12:20:13] Adding lifeycle views
    [08/22/2019 12:20:13] Adding Integers table
    [08/22/2019 12:20:14] Adding indexes
    [08/22/2019 12:20:14] Running report console initialisation
    [08/22/2019 12:30:13] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:30:13] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:30:13] --------------------------------------------------------------------------------
    [08/22/2019 12:30:13] No FTP host given, skipping download and extraction.
    [08/22/2019 12:30:13] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 21.559 seconds (168.500 MB/sec).
    [08/22/2019 12:30:36] Running shared patches
    [08/22/2019 12:30:37] Denormalising columns for report console
    [08/22/2019 12:30:37] Adding functions
    [08/22/2019 12:30:37] Adding misc. indexes
    [08/22/2019 12:30:38] Patching erroneous cost prices
    [08/22/2019 12:30:38] Patching high-value uncategorised products
    [08/22/2019 12:30:38] Adding denormalised columns
    [08/22/2019 12:30:38]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:30:45]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:31:02] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:31:10]     adding denormalised columns to Despatch
    [08/22/2019 12:31:15]     adding denormalised columns to Account
    [08/22/2019 12:31:31]     adding denormalised columns to Category
    [08/22/2019 12:31:31] Adding date tables
    [08/22/2019 12:31:31]     adding date functions
    [08/22/2019 12:31:31]     Days table
    [08/22/2019 12:31:32]     Months table
    [08/22/2019 12:31:32]     Quarters table
    [08/22/2019 12:31:32] Adding lifeycle views
    [08/22/2019 12:31:32] Adding Integers table
    [08/22/2019 12:31:32] Adding indexes
    [08/22/2019 12:31:32] Running report console initialisation
    [08/22/2019 12:32:28] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:32:28] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:32:28] --------------------------------------------------------------------------------
    [08/22/2019 12:32:28] No FTP host given, skipping download and extraction.
    [08/22/2019 12:32:28] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 20.033 seconds (181.335 MB/sec).
    [08/22/2019 12:32:49] Running shared patches
    [08/22/2019 12:32:50] Denormalising columns for report console
    [08/22/2019 12:32:50] Adding functions
    [08/22/2019 12:32:50] Adding misc. indexes
    [08/22/2019 12:32:50] Patching erroneous cost prices
    [08/22/2019 12:32:51] Patching high-value uncategorised products
    [08/22/2019 12:32:51] Adding denormalised columns
    [08/22/2019 12:32:51]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:32:59]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:33:16] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:33:23]     adding denormalised columns to Despatch
    [08/22/2019 12:33:28]     adding denormalised columns to Account
    [08/22/2019 12:33:44]     adding denormalised columns to Category
    [08/22/2019 12:33:44] Adding date tables
    [08/22/2019 12:33:44]     adding date functions
    [08/22/2019 12:33:44]     Days table
    [08/22/2019 12:33:45]     Months table
    [08/22/2019 12:33:45]     Quarters table
    [08/22/2019 12:33:45] Adding lifeycle views
    [08/22/2019 12:33:45] Adding Integers table
    [08/22/2019 12:33:45] Adding indexes
    [08/22/2019 12:33:46] Running report console initialisation
    [08/22/2019 12:34:11] Configuring Permissions
    [08/22/2019 12:34:11] Building Datawarehouse Tables
    [08/22/2019 12:34:12] Loading valid orders
    [08/22/2019 12:34:15] Loading valid order lines
    [08/22/2019 12:34:16] Loading active complementary products
    [08/22/2019 12:34:17] Loading products
    [08/22/2019 12:34:18] Inserting dates
    [08/22/2019 12:34:19] Loading accounts
    [08/22/2019 12:34:57] Loading add to cart tracking
    [08/22/2019 12:34:58] Loading orders
    [08/22/2019 12:35:03] Loading order lines 
    Changed database context to 'PaperstoneDW'.`;

    this.inputPaneValue = input;
    this.codeWindowValue = `split ,
header
select AccountRef,LastName,FirstName,Worth
sort Worth desc
csv
`;

    this.state = {
      code: this.codeWindowValue,
      compressedCode: this.codeCompressionService.CompressCode(this.codeWindowValue),
      explanation: this.explainCommands(input, this.codeWindowValue),
      input: input,
      output: [[]],
      context: this.contextService.CreateContext(),
      topSectionHeight: 12,
      codeWindowWidth: 45,
      inputPaneWidth: 50,
      draggedBorder: undefined,
      isHelpPopupVisible: false,
      isContextPopupVisible: false
    };

    this.executeCodeTimeout = null;

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowSelect = this.handleCodeWindowSelect.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
    this.executeCommands = this.executeCommands.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.LocationHashChanged = this.LocationHashChanged.bind(this);
    this.UpdateCodeFromLocationHash = this.UpdateCodeFromLocationHash.bind(this);
    this.openHelpPopup = this.openHelpPopup.bind(this);
    this.closeHelpPopup = this.closeHelpPopup.bind(this);
    this.openContextPopup = this.openContextPopup.bind(this);
    this.closeContextPopup = this.closeContextPopup.bind(this);
    this.showFile = this.showFile.bind(this);
  }

  UpdateCodeFromLocationHash() {

    const compressedCode = window.location.hash.substr(1);

    const code = this.codeCompressionService.DecompressCode(compressedCode);

    this.codeWindowValue = code;
    
    this.setState({code: code});
  }

  LocationHashChanged() {

    this.UpdateCodeFromLocationHash();
  }

  componentDidMount() {

    window.addEventListener("hashchange", this.LocationHashChanged);
    
    if (window.location.hash) {
      
      this.UpdateCodeFromLocationHash();
    }

    this.executeCode(this.codeWindowValue, false);
  }

  componentWillUnmount() {

    window.removeEventListener("hashchange", this.LocationHashChanged);
  }

  handleInputPaneInput(input: string) {
    
    this.inputPaneValue = input.replace(/\\n/g, String.fromCharCode(0));

    this.setState({input: input});

    this.executeCode(this.codeWindowValue, false);
  }

  handleCodeWindowInput(code: string) {
        
    this.codeWindowValue = code;

    let compressedCode = this.codeCompressionService.CompressCode(code);
    
    window.location.hash = "#" + compressedCode;

    this.setState({code: code});
  }

  handleCodeWindowSelect(code: string) {

    let txtarea = document.getElementsByClassName("js-code-window-textarea")[0] as HTMLTextAreaElement;

    let start = txtarea.selectionStart;
    let finish = txtarea.selectionEnd;

    if (finish - start > 0) {

      let selectedCode = txtarea.value.substring(start, finish);

      let returnCount = txtarea.value.substring(0, start).split(/\n/g).filter(i => i).length;

      selectedCode = "\n".repeat(returnCount) + selectedCode;

      this.executeCode(selectedCode, true);
    }
    else {

      this.executeCode(code, true);
    }
  }

  private executeCodeTimeout: NodeJS.Timeout | null;

  executeCode(code: string, isSelect: boolean) {

    if (this.executeCodeTimeout) {
      clearTimeout(this.executeCodeTimeout);
    }

    const that = this;

    let timeoutLength: number;

    if (this.inputPaneValue.length < 10000) {
      timeoutLength = 0;
    }
    else if (this.inputPaneValue.length < 200000) {
      timeoutLength = 100;
    }
    else {
      timeoutLength = isSelect ? 650 : 350;
    }

    this.executeCodeTimeout = setTimeout(function () {

      const result = that.executeCommands(that.inputPaneValue, code);
      const explanation = that.explainCommands(that.inputPaneValue, code);

      that.setState({ output: result, explanation: explanation });
    },
    timeoutLength);
  }

  private executeCommands(input: string, code: string): string[][] {

    return this.processCommands(input, code, false);
  }

  private explainCommands(input: string, code: string): string {

    return this.processCommands(input, code, true).join("\n");
  }

  private processCommands(input: string, code: string, explain: boolean): string[][] {

    const lines = this.textUtilsService.TextToLines(input);

    const context = this.contextService.CreateContext();

    const result = this.commandService.processCommands(code, lines, explain, context);

    if (!explain) {

      this.setState({ context: context });
    }

    return result; 
  }

  onDragStart(e: React.DragEvent<HTMLDivElement>) {

    this.setState({ 
      draggedBorder: (e.target as HTMLDivElement).dataset.borderId
    })
  }

  onDragEnd(e: React.DragEvent<HTMLDivElement>) {

    this.setState({
      draggedBorder: undefined
    })
  }

  onDragOver(e: React.DragEvent<HTMLDivElement>) {

    if (this.state.draggedBorder === "top-section-border") {
      this.setState({ topSectionHeight: e.clientY / 16 });
    }
    else if (this.state.draggedBorder === "code-window-border") {
      this.setState({ codeWindowWidth: e.clientX / 16 });
    }
    else if (this.state.draggedBorder === "input-pane-border") {
      this.setState({ inputPaneWidth: e.clientX / 16 });
    }
  }

  openHelpPopup() {
    this.setState({ isHelpPopupVisible: true });
  }

  closeHelpPopup() {
    this.setState({ isHelpPopupVisible: false });
  }

  openContextPopup() {
    this.setState({ isContextPopupVisible: true });
  }

  closeContextPopup() {
    this.setState({ isContextPopupVisible: false });
  }

  showFile(e: React.ChangeEvent<HTMLInputElement>) {

    e.preventDefault();

    const reader = new FileReader();

    reader.onload = (e) => { 

      if (e.target && e.target.result) {
        
        this.handleInputPaneInput(e.target.result.toString());
      }
    };

    if (e.target && e.target.files) {

      reader.readAsText(e.target.files[0]);
    }
  }

  render() {
    return (
      <div className="App">        
        <div className={`${this.state.isHelpPopupVisible ? "" : "u-hidden"}`}>
          <Popup            
            onClose={this.closeHelpPopup}
            title="Help"
            init_left={-21}
            init_top={2}
            init_right={-1}
            init_bottom={-10}>
              <HelpPopupContent commandTypesService={this.commandTypesService} />
          </Popup>
        </div>      
        <div className={`${this.state.isContextPopupVisible ? "" : "u-hidden"}`}>
          <Popup            
            onClose={this.closeContextPopup}
            title="Context"
            init_left={-41}
            init_top={2}
            init_right={-23}
            init_bottom={18}>
              <ContextPopupContent context={this.state.context} />
          </Popup>
        </div>
        <div className="string-tools" 
             onDragOver={this.onDragOver} 
             onDragEnd={this.onDragEnd}>
             <div className="string-tools__popup-links popup-links">
              <div className="popup-links__link popup-links__context-link" onClick={this.openContextPopup}>context</div>
              <div className="popup-links__separator">|</div>
              <div className="popup-links__link popup-links__help-link" onClick={this.openHelpPopup}>help</div>
            </div>
          <div className="string-tools__top-section" style={ { height: this.state.topSectionHeight + "rem" }}>
            <div className="string-tools__code-window-container" style={ { width: this.state.codeWindowWidth + "rem" }}>
              <CodeWindow onInput={this.handleCodeWindowInput}
                          onSelect={this.handleCodeWindowSelect}
                          textUtilsService={this.textUtilsService} value={this.state.code} />
            </div>
            <div className="string-tools__code-window-border" draggable onDragStart={this.onDragStart} data-border-id="code-window-border"></div>
            <div className="string-tools__explain-window-container">
              <ExplainWindow explanation={this.state.explanation} textUtilsService={this.textUtilsService} />
            </div>
          </div>
          <div className="string-tools__top-section-border" draggable onDragStart={this.onDragStart} data-border-id="top-section-border"></div>
          <div><input type="file" onChange={(e) => this.showFile(e)} /></div>
          <div className="panes-container">
            <div className="string-tools__input-pane-container" style={ { width: this.state.inputPaneWidth + "rem" }}>
              <InputPane 
                lines={this.textUtilsService.TextToLines(this.state.input)}
                width={this.state.inputPaneWidth}
                charWidth={1}
                height={42} 
                lineHeight={1.25} 
                textUtilsService={this.textUtilsService} />
            </div>
            <div className="string-tools__input-pane-border" draggable onDragStart={this.onDragStart} data-border-id="input-pane-border"></div>
            <div className="string-tools__output-pane-container">
              <OutputPane output={this.state.output} height={42} lineHeight={1.25} textUtilsService={this.textUtilsService} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
