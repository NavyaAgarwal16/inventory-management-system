import { Injectable }

from '@angular/core';

@Injectable({

  providedIn: 'root'

})

export class TrackRecordService {

  productHistory: any[] = [];

  rawMaterialHistory: any[] = [];

}