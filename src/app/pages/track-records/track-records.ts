import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'

import { ChangeDetectorRef } from '@angular/core';

import { ProductService } from '../../services/product';

import { DispatchProductService } from '../../services/dispatch-product.service';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';


@Component({

  selector: 'app-track-records',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl: './track-records.html',

  styleUrls: ['./track-records.css']

})

export class TrackRecordsComponent implements OnInit {

  selectedSection = 'products';

  productHistoryFilter = 'Both';

  rawMaterialFilter = 'Both';

  productSortBy = '';

  productFilterBy = '';

  rawMaterialSortBy = '';

  rawMaterialFilterBy = '';

  productHistoryList: any[] = [];

  rawMaterialHistoryList: any[] = [];

  manufacturedProducts: any[] = [];

  dispatchedProducts: any[] = [];

  fromDate = '';

  toDate = '';

  searchText = '';

  totalRecords = 0;

  manufacturedCount = 0;

  dispatchedCount = 0;

  lowStockCount = 0;

  currentPage = 1;

  itemsPerPage = 10;

  paginatedProductHistory: any[] = [];


  ngOnInit() {

    this.selectedSection = 'products';

    this.productHistoryFilter = 'Manufactured';

    this.getManufacturedProducts();

    this.getDispatchedProducts();



  }

  constructor(

    private productService:

      ProductService,

    private dispatchProductService:

      DispatchProductService,


    private cdr: ChangeDetectorRef


  ) { }


  applyProductSort() {

    if (

      this.productSortBy ===

      'name-asc'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          a.productName.localeCompare(

            b.productName

          )

      );

    }

    else if (

      this.productSortBy ===

      'name-desc'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          b.productName.localeCompare(

            a.productName

          )

      );

    }

    else if (

      this.productSortBy ===

      'date-new'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          new Date(b.date).getTime()

          -

          new Date(a.date).getTime()

      );

    }

    else if (

      this.productSortBy ===

      'date-old'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          new Date(a.date).getTime()

          -

          new Date(b.date).getTime()

      );

    }



  }

  applyProductFilter() {

    if (

      this.productFilterBy ===

      'amount-low'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          a.amount - b.amount

      );

    }

    else if (

      this.productFilterBy ===

      'amount-high'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          b.amount - a.amount

      );

    }

    else if (

      this.productFilterBy ===

      'stock-high'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          b.quantity - a.quantity

      );

    }

    else if (

      this.productFilterBy ===

      'stock-low'

    ) {

      this.productHistoryList.sort(

        (a, b) =>

          a.quantity - b.quantity

      );

    }

  }

  showProductHistory() {
    console.log(this.productHistoryList.length);

    if (

      this.productHistoryFilter ===

      'Manufactured'

    ) {

      this.productHistoryList = [

        ...this.manufacturedProducts

      ];

    }

    else if (

      this.productHistoryFilter ===

      'Dispatched'

    ) {

      this.productHistoryList = [

        ...this.dispatchedProducts

      ];

    }

    else {

      this.productHistoryList = [

        ...this.manufacturedProducts,

        ...this.dispatchedProducts

      ];

    }
    this.updateSummaryCards();

    this.updatePagination();


  }

  setProductFilter(filter: string) {

    this.productHistoryFilter = filter;

    this.showProductHistory();

  }

  getManufacturedProducts() {

    this.productService

      .getProducts()

      .subscribe({

        next: (res: any) => {

          this.manufacturedProducts =

            res.products.map(

              (product: any) => ({

                productName:

                  product.productName,

                productId:

                  product.productId,

                quantity:

                  product.quantity,

                amount:

                  product.amount,

                totalCost:

                  Number(product.quantity || 0)

                  *

                  Number(product.amount || 0),

                stockStatus:

                  product.stockStatus,

                action:

                  'Manufactured',

                date:

                  product.createdAt ||

                  new Date()

              })

            );

          this.showProductHistory();
          this.cdr.detectChanges();
          this.selectedSection = 'products';

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  getDispatchedProducts() {

    this.dispatchProductService

      .getDispatchProducts()

      .subscribe({

        next: (res: any) => {

          this.dispatchedProducts =

            res.products.map(

              (product: any) => ({

                productName:

                  product.productName,

                productId:

                  product.productId,

                receiverName:

                  product.receiverName,

                receiverId:

                  product.receiverId,

                quantity:

                  product.quantity,

                amount:

                  product.amount,

                totalCost:

                  product.totalCost,

                sellingTotalCost:

                  product.sellingTotalCost,

                profitLossAmount:

                  product.profitLossAmount,

                isProfit:

                  product.isProfit,


                stockStatus:

                  product.stockStatus,

                action:

                  'Dispatched',

                date:

                  product.dispatchDate

              })

            );

          this.showProductHistory();
          this.cdr.detectChanges();
          this.selectedSection = 'products';

        }

      });

  }

  exportProductHistoryToExcel() {

    const formattedData =

      this.productHistoryList.map(

        (item: any) => ({

          'Product Name':

            item.productName,

          'Product ID':

            item.productId,

          'Receiver Name':

            item.receiverName,

          'Receiver ID':

            item.receiverId,

          'Quantity':

            item.quantity,

          'Amount (₹)':

            item.amount,

          'Total Cost (₹)':

            item.totalCost,

          'Stock Status':

            item.stockStatus,

          'Action':

            item.action,

          'Date':

            new Date(

              item.date

            ).toLocaleString()

        })

      );

    const worksheet =

      XLSX.utils.json_to_sheet(

        formattedData

      );

    worksheet['!cols'] = [

      { wch: 25 },

      { wch: 18 },

      { wch: 22 },

      { wch: 20 },

      { wch: 12 },

      { wch: 15 },

      { wch: 18 },

      { wch: 18 },

      { wch: 15 },

      { wch: 25 }

    ];

    const workbook =

      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Product History'

    );

    const excelBuffer =

      XLSX.write(

        workbook,

        {

          bookType: 'xlsx',

          type: 'array'

        }

      );

    const blob = new Blob(

      [excelBuffer],

      {

        type:

          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

      }

    );

    saveAs(

      blob,

      'Product-History.xlsx'

    );

  }

  searchProducts() {

    const search =

      this.searchText
        .toLowerCase();

    this.productHistoryList = [

      ...this.manufacturedProducts,

      ...this.dispatchedProducts

    ].filter(item =>

      item.productName
        ?.toLowerCase()
        .includes(search)

      ||

      item.productId
        ?.toLowerCase()
        .includes(search)

    );

  }

  filterByDate() {

    this.productHistoryList =

      this.productHistoryList.filter(

        item => {

          const itemDate =

            new Date(item.date);

          return (

            itemDate >=
            new Date(this.fromDate)

            &&

            itemDate <=
            new Date(this.toDate)

          );

        }

      );

  }

  updateSummaryCards() {

    if (this.productHistoryFilter === 'Manufactured') {

      this.totalRecords =
        this.manufacturedProducts.length;

      this.manufacturedCount =
        this.manufacturedProducts.length;

      this.dispatchedCount = 0;

      this.lowStockCount =
        this.manufacturedProducts.filter(
          p => p.stockStatus === 'Low Stock'
        ).length;

    }

    else if (
      this.productHistoryFilter === 'Dispatched'
    ) {

      this.totalRecords =
        this.dispatchedProducts.length;

      this.manufacturedCount = 0;

      this.dispatchedCount =
        this.dispatchedProducts.length;

      this.lowStockCount =
        this.manufacturedProducts.filter(
          p => p.stockStatus === 'Low Stock'
        ).length;

    }

    else {

      this.totalRecords =
        this.productHistoryList.length;

      this.manufacturedCount =
        this.manufacturedProducts.length;

      this.dispatchedCount =
        this.dispatchedProducts.length;

      this.lowStockCount =
        this.manufacturedProducts.filter(
          p => p.stockStatus === 'Low Stock'
        ).length;

    }

  }

  updatePagination() {

    const startIndex =

      (this.currentPage - 1)

      * this.itemsPerPage;

    const endIndex =

      startIndex + this.itemsPerPage;

    this.paginatedProductHistory =

      this.productHistoryList.slice(

        startIndex,

        endIndex

      );

  }

  changeItemsPerPage() {

    this.currentPage = 1;

    this.updatePagination();

  }

  get totalPages(): number {

    return Math.ceil(

      this.productHistoryList.length

      /

      this.itemsPerPage

    );

  }

  previousPage() {

    if (

      this.currentPage > 1

    ) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  nextPage() {

    if (

      this.currentPage <

      this.totalPages

    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  getVisiblePages(): (number | string)[] {

    const pages: (number | string)[] = [];

    const total = this.totalPages;

    const current = this.currentPage;

    if (total <= 7) {

      for (let i = 1; i <= total; i++) {

        pages.push(i);

      }

    }

    else {

      pages.push(1);

      if (current > 4) {

        pages.push('...');

      }

      const start =

        Math.max(2, current - 1);

      const end =

        Math.min(

          total - 1,

          current + 1

        );

      for (

        let i = start;

        i <= end;

        i++

      ) {

        pages.push(i);

      }

      if (

        current < total - 3

      ) {

        pages.push('...');

      }

      pages.push(total);

    }

    return pages;

  }
  goToPage(page: number) {

    this.currentPage = page;

    this.updatePagination();

  }


}