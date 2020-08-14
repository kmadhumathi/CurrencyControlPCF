import {IInputs, IOutputs} from "./generated/ManifestTypes";

interface ExchangeRate {
    base: string,
    date: string,
    rates: any
}

export class currencyPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private exchangeRateApiUrl: string;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;

    private exchangeRatesList: ExchangeRate; 
    
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
        // Add control initialization code
        this.exchangeRateApiUrl = "https://api.exchangeratesapi.io/"
        this._container = container;
        this._context = context;
        this.setExchangeRateList("USD");
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
        this.setExchangeRateForCurrSelected();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
    }

    private setExchangeRateList(base: string, date?: string): void {

        date = date ? date : "latest";
        fetch(this.exchangeRateApiUrl + date + "?base=" + base).then((response) => {
            response.json().then((result) => {
                this.exchangeRatesList = result;
                this.setExchangeRateForCurrSelected();
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    private setExchangeRateForCurrSelected() {
        
        let currencySelected = this._context.parameters.currency.raw;
        let options: ComponentFramework.PropertyHelper.OptionMetadata[] | undefined = this._context.parameters.currency.attributes?.Options;
        if (options) {
            for (var i = 0; i < options.length; i++) {
                let temp: number = options[i].Value;;
                if (temp == currencySelected) {
                    // this needs to be changed to  setting the exchange rate field to this.exchangeRatesList.rates[options[i].Label]
                    this._container.innerText = "Exchange Rate: " + options[i].Label;
                    break;
                }
            }
        }
        console.log(currencySelected);

        // set the exchange rate field instead of displaying like this - 
        //if (currencySelected)
           //this._container.innerText = "Exchange Rate: " + this.exchangeRatesList.rates[currencySelected];
    }
}