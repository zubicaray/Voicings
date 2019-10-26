import { Component, OnInit } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { InAppPurchase2 , IAPProduct} from '@ionic-native/in-app-purchase-2/ngx';
import { TranslationProvider } from '../../providers/translation/translation';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {

  ErrorMsg:string;

  public product: any = {
    name: 'Jazz Chord Voicings Maker',
    appleProductId: '1234',
    googleProductId: 'android.test.purchased'//this.program.googleProductId;
  };

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private store: InAppPurchase2, public platform: Platform,
    private TP: TranslationProvider) 
  {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RegisterPage');
  }


  ngOnInit() {
    this.configurePurchasing();
  }

  configurePurchasing() {
    if (!this.platform.is('cordova')) { return; }
    let productId;
    try {
      if (this.platform.is('ios')) {
        productId = this.product.appleProductId;
      } else if (this.platform.is('android')) {
        productId = this.product.googleProductId;
      }

      // Register Product
      // Set Debug High
      this.store.verbosity = this.store.DEBUG;
      // Register the product with the store
      this.store.register({
        id: productId,
        alias: productId,
        type: this.store.NON_RENEWING_SUBSCRIPTION
      });

      this.registerHandlers(productId);

      this.store.ready((status) => {
        console.log(JSON.stringify(this.store.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.store.products));
      });
      // Errors On The Specific Product
      this.store.when(productId).error( (error) => {
        alert('An Error Occured' + JSON.stringify(error));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) {
      console.log(this.TP.tr('Error On Store Issues') + JSON.stringify(err));
    }
  }

  registerHandlers(productId) {
    // Handlers
    this.store.when(productId).approved( (product: IAPProduct) => {
      // Purchase was approved
      product.finish();
    });

    this.store.when(productId).registered( (product: IAPProduct) => {
      console.log('Registered: ' + JSON.stringify(product));
    });

    this.store.when(productId).updated( (product: IAPProduct) => {
      console.log(this.TP.tr('Loaded') + JSON.stringify(product));
    });

    this.store.when(productId).cancelled( (product) => {
      alert(this.TP.tr('Purchase was Cancelled'));
    });

    // Overall Store Error
    this.store.error( (err) => {
      alert(this.TP.tr('Store Error ') + JSON.stringify(err));
    });
  }

  async purchase() {
    // Only configuring purchase when you want to buy, because when you configure a purchase
    //It prompts the user to input their apple id info on config which is annoying 
    //if (!this.platform.is('cordova')) { return };

    let productId;

    if (this.platform.is('ios')) {
      productId = this.product.appleProductId;
    } else if (this.platform.is('android')) {
      productId = this.product.googleProductId;
    }

    console.log('Products: ' + JSON.stringify(this.store.products));
    console.log('Ordering From Store: ' + productId);
    try {
      let product = this.store.get(productId);
      console.log('Product Info: ' + JSON.stringify(product));
      let order = await this.store.order(productId);
      alert(this.TP.tr('Finished Purchase'));
      this.ErrorMsg=JSON.stringify(product);
    } catch (err) {
      console.log(this.TP.tr('Error Ordering ') + JSON.stringify(err));
      this.ErrorMsg==JSON.stringify(err);
    }
  }

   async configureRestore() {
		// Only works with an emulator or real device
		if (!this.platform.is('cordova')) { return; }
		let productId;
		try {
			if (this.platform.is('ios')) {
				productId = this.product.appleProductId;
			} else if (this.platform.is('android')) {
				productId = this.product.googleProductId;
			}

			// Register Product
			// Set Debug High
			this.store.verbosity = this.store.DEBUG;
			// Register the product with the store
			this.store.register({
				id: productId,
				alias: productId,
				type: this.store.NON_CONSUMABLE
			});

			this.registerHandlers(productId);

			// Errors On The Specific Product
			this.store.when(productId).error( (error) => {
				alert(this.TP.tr('An Error Occured') + JSON.stringify(error));
			});
			// Refresh Always
			console.log('Refresh Store');
			this.store.refresh();
		} catch (err) {
			console.log(this.TP.tr('Error On Store Issues') + JSON.stringify(err));
      this.ErrorMsg=JSON.stringify(err);
		}

	}

	
	async restorepurchase() {
		if (!this.platform.is('cordova')) { return };
		this.configureRestore();

		let productId;

		if (this.platform.is('ios')) {
			productId = this.product.appleProductId;
		} else if (this.platform.is('android')) {
			productId = this.product.googleProductId;
		}

		console.log('Products: ' + JSON.stringify(this.store.products));
		console.log('Refreshing Store: ' + productId);
		try {
			let product = this.store.get(productId);
			console.log('Product Info: ' + JSON.stringify(product));
      this.ErrorMsg=JSON.stringify(product);
			this.store.refresh();
			alert(this.TP.tr('Finished Restore'));
		} catch (err) {
			console.log('Error Ordering ' + JSON.stringify(err));
      this.ErrorMsg=JSON.stringify(err);
		}
	}

}
