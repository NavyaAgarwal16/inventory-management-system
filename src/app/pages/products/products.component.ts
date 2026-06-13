import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ProductService } from '../../services/product';

import { FormsModule } from '@angular/forms'

import { TrackRecordService } from '../../services/track-record.service';

import { DispatchProductService } from '../../services/dispatch-product.service';


@Component({
  selector: 'app-products',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './products.component.html',

  styleUrls: ['./products.component.css']



})

export class ProductsComponent implements OnInit {

  productsList: any[] = [];

  allProducts: any[] = [];

  searchText = '';

  showSearchFilters = false;

  selectedFilters: string[] = [];

  showHistoryPopup = false;

  selectedProductHistory: any[] = [];

  showAddProductPopup = false;

  isEditMode = false;

  editingProductId = '';

  productName = '';

  productId = '';

  quantity = 0;

  amount = 0;

  receiverName = '';

  receiverId = '';

  totalCost = 0;

  image = '';

  stockStatus = 'In Stock';

  lowStockLimit = 20;

  productIdError = '';

  receiverIdError = '';

  quantityError = '';

  amountError = '';

  totalProducts = 0;

  lowStockProducts = 0;

  totalInventoryCost = 0;

  totalQuantity = 0;

  showDispatchPopup = false;

  dispatchReceiverName = '';

  dispatchReceiverId = '';

  dispatchQuantity = 0;

  dispatchAmount: number | null = null;

  dispatchTotalCost: number | null = null;
  selectedProduct: any = null;

  receiverList: any[] = [];

  filteredReceiverNames: any[] = [];

  filteredReceiverIds: any[] = [];

  showNameDropdown = false;

  showIdDropdown = false;

  lowStockList: any[] = [];

  sellingTotalCost: number | null = null;

  profitLossAmount: number | null = null;

  isProfit = false;

  newCostPerUnit: number | null = null;

  dispatchReceiverNameError = '';

  dispatchReceiverIdError = '';

  dispatchQuantityError = '';



  constructor(

    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private trackRecordService: TrackRecordService,
    private dispatchProductService: DispatchProductService

  ) { }

  ngOnInit() {

    this.getAllProducts();

    this.loadReceiverList();


  }


  filterReceiverNames() {

    if (

      !this.dispatchReceiverName

    ) {

      this.filteredReceiverNames = [];

      this.dispatchReceiverId = '';

      return;

    }

    this.showNameDropdown = true;

    this.filteredReceiverNames =

      this.receiverList.filter(

        (receiver: any) =>

          receiver.name

            .toLowerCase()

            .includes(

              this.dispatchReceiverName

                .toLowerCase()

            )

      );

    const existingReceiver =

      this.receiverList.find(

        (receiver: any) =>

          receiver.name

            .toLowerCase()

          ===

          this.dispatchReceiverName

            .toLowerCase()

      );

    if (existingReceiver) {

      this.dispatchReceiverId =

        existingReceiver.id;

    }

    else {

      this.dispatchReceiverId =

        this.generateReceiverId();

    }

  }

  filterReceiverIds() {

    if (

      !this.dispatchReceiverId

    ) {

      this.filteredReceiverIds = [];

      return;

    }

    this.showIdDropdown = true;

    this.filteredReceiverIds =

      this.receiverList.filter(

        (receiver: any) =>

          receiver.id

            .toLowerCase()

            .includes(

              this.dispatchReceiverId

                .toLowerCase()

            )

      );

  }

  selectReceiverName(receiver: any) {

    this.dispatchReceiverName =

      receiver.name;

    this.dispatchReceiverId =

      receiver.id;

    this.showNameDropdown = false;

  }

  selectReceiverId(receiver: any) {

    this.dispatchReceiverId =

      receiver.id;

    this.dispatchReceiverName =

      receiver.name;

    this.showIdDropdown = false;

  }

  loadReceiverList() {

    this.dispatchProductService

      .getDispatchProducts()

      .subscribe({

        next: (res: any) => {

          const uniqueReceivers =

            new Map();

          res.products.forEach(

            (item: any) => {

              if (

                item.receiverName &&

                item.receiverId

              ) {

                uniqueReceivers.set(

                  item.receiverId,

                  {

                    name:

                      item.receiverName,

                    id:

                      item.receiverId

                  }

                );

              }

            }

          );

          this.receiverList =

            Array.from(

              uniqueReceivers.values()

            );

          console.log(this.receiverList);

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  onReceiverNameChange() {

    const foundReceiver =

      this.receiverList.find(

        (receiver: any) =>

          receiver.name ===

          this.dispatchReceiverName

      );

    if (foundReceiver) {

      this.dispatchReceiverId =

        foundReceiver.id;

    }

  }

  onReceiverIdChange() {

    const foundReceiver =

      this.receiverList.find(

        (receiver: any) =>

          receiver.id ===

          this.dispatchReceiverId

      );

    if (foundReceiver) {

      this.dispatchReceiverName =

        foundReceiver.name;

    }

  }

  getAllProducts() {

    this.productService
      .getProducts()
      .subscribe({

        next: (res: any) => {

          this.productsList =
            res.products;

          this.cdr.detectChanges();

          this.allProducts = res.products;

          this.lowStockList =

            res.products.filter(

              (product: any) =>

                product.quantity <=

                product.lowStockLimit

            );

          this.calculateAnalytics();



        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  addProduct() {

    if (this.isEditMode) {

      this.updateExistingProduct();

      return;

    }
    if (

      this.quantity <=
      this.lowStockLimit

    ) {

      this.stockStatus =
        'Low Stock';

    }

    else {

      this.stockStatus =
        'In Stock';

    }


    const data = {

      productName:

        this.productName || '',

      productId:

        this.productId || '',

      quantity:

        Number(this.quantity || 0),

      amount:

        Number(this.amount || 0),

      totalCost:

        Number(this.totalCost || 0),

      image: this.image,

      stockStatus: this.stockStatus,

      inventoryHistory: [

        {

          action: 'Product Added',

          quantity: this.quantity

        }

      ],



    };

    console.log('Sending Product', data);

    this.productService
      .addProduct(data)
      .subscribe({

        next: (res: any) => {


          this.showAddProductPopup = false;


          this.getAllProducts();

          this.productName = '';

          this.productId = '';

          this.quantity = 0;

          this.amount = 0;

          this.totalCost = 0;

          this.image = '';

        },

        error: (err: any) => {

          console.log('ERROR', err);

          alert(err.error.message);

        }

      });

  }

  calculateTotalCost() {


    this.totalCost =

      Number(this.amount || 0) *

      Number(this.quantity || 0);

  }

  deleteProduct(id: string) {

    this.productService
      .deleteProduct(id)
      .subscribe({

        next: (res: any) => {

          this.getAllProducts();

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  editProduct(product: any) {

    this.isEditMode = true;

    this.editingProductId =
      product._id;

    this.showAddProductPopup = true;

    this.productName =
      product.productName;

    this.productId =
      product.productId;

    this.quantity =
      product.quantity;

    this.amount =
      product.amount;

    this.receiverName =
      product.receiverName;

    this.receiverId =
      product.receiverId;

    this.totalCost =
      product.totalCost;

    this.image =
      product.image;

    this.stockStatus =
      product.stockStatus;

  }

  updateExistingProduct() {

    if (

      this.quantity <=
      this.lowStockLimit

    ) {

      this.stockStatus =
        'Low Stock';

    }

    else {

      this.stockStatus =
        'In Stock';

    }

    const data = {

      productName: this.productName,

      productId: this.productId,

      quantity: this.quantity,

      amount: this.amount,

      receiverName: this.receiverName,

      receiverId: this.receiverId,

      totalCost: this.totalCost,

      image: this.image,

      stockStatus: this.stockStatus,

      inventoryHistory: [

        {

          action: 'Product Updated',

          quantity: this.quantity

        }

      ],

    };

    this.productService
      .updateProduct(

        this.editingProductId,
        data

      )
      .subscribe({

        next: (res: any) => {



          this.showAddProductPopup = false;

          this.isEditMode = false;

          this.getAllProducts();

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  toggleFilter(filter: string) {

    if (

      this.selectedFilters.includes(filter)

    ) {

      this.selectedFilters =

        this.selectedFilters.filter(

          item => item !== filter

        );

    }

    else {

      this.selectedFilters.push(filter);

    }

  }

  searchProducts() {

    const text =

      this.searchText
        .toLowerCase();

    if (

      this.selectedFilters.length === 0

    ) {

      this.productsList =
        this.allProducts;

      return;

    }

    this.productsList =

      this.allProducts.filter(

        (product: any) => {

          return this.selectedFilters.some(

            (filter: string) => {

              if (

                filter === 'Product Name'

              ) {

                return product.productName
                  ?.toLowerCase()
                  .includes(text);

              }

              if (

                filter === 'Product ID'

              ) {

                return product.productId
                  ?.toLowerCase()
                  .includes(text);

              }

              if (

                filter === 'Receiver Name'

              ) {

                return product.receiverName
                  ?.toLowerCase()
                  .includes(text);

              }

              if (

                filter === 'Receiver ID'

              ) {

                return product.receiverId
                  ?.toLowerCase()
                  .includes(text);

              }

              return false;

            }

          );

        }

      );

  }

  generateProductId() {

    if (!this.productName) {

      return;

    }

    const prefix =

      this.productName
        .substring(0, 3)
        .toUpperCase();

    const random =

      Math.floor(

        1000 + Math.random() * 9000

      );

    this.productId =

      `PROD-${prefix}-${random}`;

  }

  generateReceiverId() {

    if (

      !this.dispatchReceiverName

    ) {

      return '';

    }

    const prefix =

      this.dispatchReceiverName

        .substring(0, 3)

        .toUpperCase();

    const randomNumber =

      Math.floor(

        1000 + Math.random() * 9000

      );

    return `REC-${prefix}-${randomNumber}`;

  }

  onReceiverNameBlur() {

    const existingReceiver =

      this.receiverList.find(

        (receiver: any) =>

          receiver.name

            .toLowerCase()

          ===

          this.dispatchReceiverName

            .toLowerCase()

      );

    if (existingReceiver) {

      this.dispatchReceiverId =

        existingReceiver.id;

    }

    else if (

      this.dispatchReceiverName.trim()

    ) {

      this.dispatchReceiverId =

        this.generateReceiverId();

    }

  }

  calculateAnalytics() {


    this.totalProducts =

      this.productsList.length;

    this.lowStockProducts =

      this.productsList.filter(

        (product: any) =>

          product.stockStatus ===

          'Low Stock'

      ).length;

    this.totalInventoryCost =

      this.productsList.reduce(

        (total: number, product: any) =>

          total +

          Number(product.totalCost || 0),

        0

      );

    this.totalQuantity =

      this.productsList.reduce(

        (total: number, product: any) =>

          total +

          Number(product.quantity || 0),

        0

      );
    this.cdr.detectChanges();

  }

  openHistory(product: any) {

    console.log(product);
    this.showAddProductPopup = false;

    this.selectedProductHistory =

      product.inventoryHistory || [
        {
          action: 'No history available',

          quantity: product.quantity,

          date: new Date()


        }
      ];

    this.showHistoryPopup = true;

  }

  openDispatchPopup(product: any) {

    this.selectedProduct = product;

    this.showDispatchPopup = true;

    this.dispatchReceiverName = '';

    this.dispatchReceiverId = '';

    this.dispatchQuantity = 0;

    this.dispatchAmount =

      Number(product.amount || 0);

    this.dispatchTotalCost = null;

    this.sellingTotalCost = null;

    this.profitLossAmount = null;

    this.isProfit = false;

    this.newCostPerUnit = null;

  }


  generateDispatchReceiverId() {

    if (!this.dispatchReceiverName) {

      return;

    }

    const prefix =

      this.dispatchReceiverName
        .substring(0, 3)
        .toUpperCase();

    const random =

      Math.floor(

        1000 + Math.random() * 9000

      );

    this.dispatchReceiverId =

      `REC-${prefix}-${random}`;

  }

  calculateDispatchTotal() {

    this.cdr.detectChanges();
    this.dispatchTotalCost =

      Number(this.dispatchQuantity || 0)

      *

      Number(this.dispatchAmount || 0);

    this.sellingTotalCost =

      this.dispatchTotalCost;

    this.calculateSellingMetrics();

  }


  dispatchProduct() {

    this.dispatchReceiverNameError = '';

    this.dispatchReceiverIdError = '';

    this.dispatchQuantityError = '';

    if (

      !this.dispatchReceiverName

    ) {

      this.dispatchReceiverNameError =

        'Receiver Name is required';

      return;

    }

    if (

      !this.dispatchReceiverId

    ) {

      this.dispatchReceiverIdError =

        'Receiver ID is required';

      return;

    }

    if (

      !this.dispatchQuantity

    ) {

      this.dispatchQuantityError =

        'Quantity is required';

      return;

    }

    if (

      this.dispatchQuantity <= 0

    ) {

      this.dispatchQuantityError =

        'Enter valid quantity';

      return;

    }

    if (

      !this.selectedProduct

    ) {

      return;

    }

    if (

      this.dispatchQuantity >

      this.selectedProduct.quantity

    ) {

      this.dispatchQuantityError =

        'Insufficient Stock';

      return;

    }

    const currentSellingTotalCost =

      Number(

        (

          document.querySelector(

            'input[placeholder="Enter Selling Total Cost"]'

          ) as HTMLInputElement

        )?.value || 0

      );

    const currentProfitLossAmount =

      Math.abs(

        currentSellingTotalCost

        -

        Number(this.dispatchTotalCost || 0)

      );

    const currentIsProfit =

      currentSellingTotalCost

      >=

      Number(this.dispatchTotalCost || 0);

    const currentNewCostPerUnit =

      currentSellingTotalCost

      /

      Number(this.dispatchQuantity || 1);

    const dispatchData = {

      productName:

        this.selectedProduct.productName || '',

      productId:

        this.selectedProduct.productId || '',

      receiverName:

        this.dispatchReceiverName || '',

      receiverId:

        this.dispatchReceiverId || '',

      quantity:

        Number(this.dispatchQuantity || 0),

      amount:

        Number(this.dispatchAmount || 0),

      totalCost:

        Number(this.dispatchTotalCost || 0),

      stockStatus:

        this.selectedProduct.stockStatus || '',

      sellingTotalCost:

        currentSellingTotalCost,

      profitLossAmount:

        currentProfitLossAmount,

      isProfit:

        currentIsProfit,

      newCostPerUnit:

        currentNewCostPerUnit

    };

    this.selectedProduct.quantity =

      this.selectedProduct.quantity -

      this.dispatchQuantity;

    if (

      this.selectedProduct.quantity <=

      this.selectedProduct.lowStockLimit

    ) {

      this.selectedProduct.stockStatus =

        'Low Stock';

    }

    else {

      this.selectedProduct.stockStatus =

        'In Stock';

    }

    this.productService

      .updateProduct(

        this.selectedProduct._id,

        {

          quantity:

            this.selectedProduct.quantity,

          stockStatus:

            this.selectedProduct.stockStatus

        }

      )

      .subscribe({

        next: (res: any) => {

          console.log(

            'Product Updated',

            res

          );

        },

        error: (err: any) => {

          console.log(err);

        }

      });

    if (

      !this.selectedProduct.dispatchHistory

    ) {

      this.selectedProduct.dispatchHistory = [];

    }

    this.selectedProduct.dispatchHistory.push({

      receiverName:

        dispatchData.receiverName,

      receiverId:

        dispatchData.receiverId,

      quantity:

        dispatchData.quantity,

      amount:

        dispatchData.amount,

      totalCost:

        dispatchData.totalCost,

      sellingTotalCost:

        dispatchData.sellingTotalCost,

      profitLossAmount:

        dispatchData.profitLossAmount,

      isProfit:

        dispatchData.isProfit,

      newCostPerUnit:

        dispatchData.newCostPerUnit,

      date: new Date()

    });

    this.trackRecordService.productHistory.push({

      action:

        'Dispatched',

      productName:

        dispatchData.productName,

      productId:

        dispatchData.productId,

      receiverName:

        dispatchData.receiverName,

      receiverId:

        dispatchData.receiverId,

      quantity:

        dispatchData.quantity,

      amount:

        dispatchData.amount,

      totalCost:

        dispatchData.totalCost,

      stockStatus:

        dispatchData.stockStatus,

      sellingTotalCost:

        dispatchData.sellingTotalCost,

      profitLossAmount:

        dispatchData.profitLossAmount,

      isProfit:

        dispatchData.isProfit,

      newCostPerUnit:

        dispatchData.newCostPerUnit,

      date: new Date()

    });

    console.log(dispatchData);

    this.dispatchProductService

      .addDispatchProduct(dispatchData)

      .subscribe({

        next: (res: any) => {

          console.log(

            'Dispatch Saved',

            res

          );

          this.showDispatchPopup = false;

        },

        error: (err: any) => {

          console.log(

            'Dispatch Error',

            err

          );

        }

      });

  }

  calculateSellingMetrics() {

    console.log(

      'dispatchTotalCost',

      this.dispatchTotalCost

    );

    console.log(

      'sellingTotalCost BEFORE',

      this.sellingTotalCost

    );

    const manufacturingCost =

      Number(this.dispatchTotalCost || 0);

    const sellingCost =

      Number(this.sellingTotalCost || 0);

    const difference =

      sellingCost - manufacturingCost;

    this.profitLossAmount =

      Math.abs(difference);

    this.isProfit =

      difference >= 0;

    this.newCostPerUnit =

      sellingCost /

      Number(this.dispatchQuantity || 1);

    console.log(

      'profitLossAmount',

      this.profitLossAmount

    );

  }




  @HostListener('document:click', ['$event'])

  closeSearchDropdown(event: any) {

    const clickedInside =

      event.target.closest('.search-box');

    if (!clickedInside) {

      this.showSearchFilters = false;

    }

  }

}