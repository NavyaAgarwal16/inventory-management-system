import { Injectable }

from '@angular/core';

import {

  HttpClient

} from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})

export class RawMaterialService {

  baseUrl =

    'http://localhost:3000/api/raw-materials';

  constructor(

    private http: HttpClient

  ) {}

  getRawMaterials() {

    return this.http.get(

      `${this.baseUrl}/all-raw-materials`

    );

  }

  addRawMaterial(data: any) {

    return this.http.post(

      `${this.baseUrl}/add-raw-material`,
      data

    );

  }

  deleteRawMaterial(id: string) {

    return this.http.delete(

      `${this.baseUrl}/delete-raw-material/${id}`

    );

  }

  updateRawMaterial(

    id: string,
    data: any

  ) {

    return this.http.put(

      `${this.baseUrl}/update-raw-material/${id}`,
      data

    );

  }

}