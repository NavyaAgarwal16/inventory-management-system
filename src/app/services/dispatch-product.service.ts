import { Injectable }

from '@angular/core';

import {

  HttpClient

}

from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})

export class DispatchProductService {

  apiUrl =

    'http://localhost:3000/api/dispatch-products';

  constructor(

    private http: HttpClient

  ) {}

addDispatchProduct(data: any) {

  return this.http.post(

    `${this.apiUrl}/add-dispatch-product`,

    JSON.stringify(data),

    {

      headers: {

        'Content-Type':

          'application/json'

      }

    }

  );

}


  getDispatchProducts() {

    return this.http.get(

      `${this.apiUrl}/all-dispatch-products`

    );

  }

}