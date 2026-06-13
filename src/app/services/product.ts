import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  apiUrl =
    'http://localhost:3000/api/product';

  constructor(
    private http: HttpClient
  ) {}

  // GET PRODUCTS

  getProducts() {

    return this.http.get(

      `${this.apiUrl}/all-products`

    );

  }

  // ADD PRODUCT

  addProduct(data: any) {

    return this.http.post(

      `${this.apiUrl}/add-product`,
      data

    );

  }

  deleteProduct(id: string) {

  return this.http.delete(

    `${this.apiUrl}/delete-product/${id}`

  );

}

updateProduct(id: string, data: any) {

  return this.http.put(

    `${this.apiUrl}/update-product/${id}`,
    data

  );

}

}