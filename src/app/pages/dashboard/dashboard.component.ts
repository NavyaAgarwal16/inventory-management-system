
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables, ChartConfiguration } from 'chart.js';

import { ProductService } from '../../services/product';

import { DispatchProductService } from '../../services/dispatch-product.service';

import { TrackRecordService } from '../../services/track-record.service';

import { ChangeDetectorRef } from '@angular/core';


@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [

    CommonModule,

    RouterModule,

    BaseChartDirective

  ],

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']

})

export class DashboardComponent

  implements OnInit {

  products: any[] = [];

  dispatchProducts: any[] = [];

  totalProducts = 0;

  totalStockQuantity = 0;

  totalManufacturingCost = 0;

  netProfitLoss = 0;

  isNetProfit = true;

  showProductAnalytics = false;

  activityLogs: any[] = [];

  lowStockProducts: any[] = [];

  highLossDispatches: any[] = [];


  getAbsoluteValue(

    value: number

  ) {

    return Math.abs(value);

  }

  typeofWindow =

    typeof window !== 'undefined';

  constructor(

    private router: Router,

    private cdr: ChangeDetectorRef,

    private productService:

      ProductService,

    private dispatchProductService:

      DispatchProductService,

    private trackRecordService:

      TrackRecordService



  ) {

    Chart.register(

      ...registerables

    );

  }

  ngOnInit() {

    console.log('Dashboard ngOnInit Fired');


    this.getProducts();

    this.getDispatchProducts();


    this.loadRecentActivities();


  }


  loadRecentActivities() {

    this.activityLogs =

      this.trackRecordService

        .productHistory

        .slice(-3)

        .reverse();

  }



  toggleProductAnalytics() {

    this.showProductAnalytics =

      !this.showProductAnalytics;

    if (

      this.showProductAnalytics

      &&

      this.dispatchProducts.length == 0

    ) {

      this.getDispatchProducts();

    }

  }





  getProducts() {

    this.productService

      .getProducts()

      .subscribe({

        next: (res: any) => {

          console.log('Products loaded', res);

          this.products =

            res.products;

          this.lowStockProducts =

            this.products.filter(

              product =>

                Number(product.quantity)

                <=

                Number(

                  product.lowStockLimit

                )

            );




          this.updateBarChart();

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  getDispatchProducts() {

    this.dispatchProductService

      .getDispatchProducts()

      .subscribe({

        next: (res: any) => {

          console.log('Dispatch Loaded', res);

          this.dispatchProducts =

            res.products;

          this.loadSmartAlerts();

          this.updateBarChart();

          this.cdr.detectChanges();
        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  logout() {

    localStorage.clear();

    this.router.navigate(['/']);

  }

  barChartType: 'bar' = 'bar';

  barChartData:

    ChartConfiguration<'bar'>['data']

    = {

      labels: [

        'Manufactured',

        'Dispatched'

      ],

      datasets: [

        {

          data: [0, 0],

          label: 'Products'

        }

      ]

    };

  barChartOptions:

    ChartConfiguration<'bar'>['options']

    = {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {

        legend: {

          display: true

        }

      }

    };

  updateBarChart() {

    console.log('updateBarChart running');


    const manufacturedQuantity =

      this.products.reduce(

        (total, product) =>

          total + product.quantity,

        0

      );

    const dispatchedQuantity =

      this.dispatchProducts.reduce(

        (total, product) =>

          total + product.quantity,

        0

      );

    this.barChartData.datasets[0].data = [

      manufacturedQuantity,

      dispatchedQuantity

    ];

    this.totalProducts =

      this.products.length;

    this.totalStockQuantity =

      manufacturedQuantity;

    this.totalManufacturingCost =

      this.products.reduce(

        (total, product) =>

          total +

          (product.totalCost || 0),

        0

      );


    const totalProfit =

      this.dispatchProducts.reduce(

        (total, product) => {

          if (product.isProfit) {

            return (

              total +

              (product.profitLossAmount || 0)

            );

          }

          return total;

        },

        0

      );

    const totalLoss =

      this.dispatchProducts.reduce(

        (total, product) => {

          if (!product.isProfit) {

            return (

              total +

              (product.profitLossAmount || 0)

            );

          }

          return total;

        },

        0

      );

    this.netProfitLoss =

      totalProfit - totalLoss;

    this.isNetProfit =

      this.netProfitLoss >= 0;


    this.lowStockProducts =

      this.products.filter(

        product => {

          const quantity =

            Number(

              product.quantity || 0

            );

          const lowLimit =

            Number(

              product.lowStockLimit || 0

            );

          return quantity <= lowLimit;

        }

      );

    this.highLossDispatches =

      this.dispatchProducts.filter(

        product =>

          !product.isProfit &&

          Number(

            product.profitLossAmount

          ) > 0

      );

    console.log('totalProducts', this.totalProducts);

    console.log('totalStockQuantity', this.totalStockQuantity);

    console.log('totalManufacturingCost', this.totalManufacturingCost);

    console.log('netProfitLoss', this.netProfitLoss);

    console.log('lowStockProducts', this.lowStockProducts.length);

    console.log('highLossDispatches', this.highLossDispatches.length);

  }

  loadSmartAlerts() {

    this.lowStockProducts =

      this.products.filter(

        product => {

          const quantity =

            Number(

              product.quantity || 0

            );

          const lowLimit =

            Number(

              product.lowStockLimit || 0

            );

          return quantity <= lowLimit;

        }

      );

    this.highLossDispatches =

      this.dispatchProducts.filter(

        dispatch =>

          !dispatch.isProfit

          &&

          Number(

            dispatch.profitLossAmount

          ) > 0

      );

  }













}