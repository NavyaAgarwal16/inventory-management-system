import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawMaterialService } from '../../services/raw-material';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-raw-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit {

  rawMaterialsList: any[] = [];
  allRawMaterials: any[] = [];

  searchText = '';
  showSearchFilters = false;
  selectedFilters: string[] = [];
  showHistoryPopup = false;
  selectedRawMaterialHistory: any[] = [];

  showAddRawMaterialPopup = false;
  isEditMode = false;
  editingRawMaterialId = '';

  rawMaterialName = '';
  rawMaterialId = '';
  quantity = 0;
  amount = 0;
  supplierName = '';
  supplierId = '';
  totalCost = 0;
  image = '';
  stockStatus = 'In Stock';
  lowStockLimit = 20;

  rawMaterialIdError = '';
  supplierIdError = '';
  quantityError = '';
  amountError = '';

  constructor(
    private rawMaterialService: RawMaterialService
  ) {}

  ngOnInit() {
    this.getAllRawMaterials();
  }

  getAllRawMaterials() {
    this.rawMaterialService
      .getRawMaterials()
      .subscribe({
        next: (res: any) => {
          this.rawMaterialsList = res.rawMaterials;
          this.allRawMaterials = res.rawMaterials;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  addRawMaterial() {

    this.rawMaterialIdError = '';

    this.supplierIdError = '';

this.quantityError = '';

this.amountError = '';


let isValid = true;

if (!this.supplierId) {

  this.supplierIdError =

    'Please add Supplier ID';

  isValid = false;

}

if (!this.rawMaterialId) {

  this.rawMaterialIdError =

    'Please add Raw Material ID';

  isValid = false;

}

if (!this.quantity) {

  this.quantityError =

    'Please add Quantity';

  isValid = false;

}

if (!this.amount) {

  this.amountError =

    'Please add Amount';

  isValid = false;

}

    if (!isValid) {
      return;
    }

    if (this.quantity <= this.lowStockLimit) {
      this.stockStatus = 'Low Stock';
    } else {
      this.stockStatus = 'In Stock';
    }

    const data = {
      rawMaterialName: this.rawMaterialName,
      rawMaterialId: this.rawMaterialId,
      quantity: this.quantity,
      amount: this.amount,
      supplierName: this.supplierName,
      supplierId: this.supplierId,
      totalCost: this.totalCost,
      image: this.image,
      stockStatus: this.stockStatus,
      inventoryHistory: [
        {
          action: 'Raw Material Added',
          quantity: this.quantity
        }
      ],
    };

    this.rawMaterialService
      .addRawMaterial(data)
      .subscribe({
        next: (res: any) => {
          this.showAddRawMaterialPopup = false;
          this.getAllRawMaterials();
          this.rawMaterialName = '';
          this.rawMaterialId = '';
          this.quantity = 0;
          this.amount = 0;
          this.supplierName = '';
          this.supplierId = '';
          this.totalCost = 0;
          this.image = '';
        },
        error: (err: any) => {

  console.log(err);

  console.log(err.error);

  alert('Raw Material Not Added: ');


}
      });
  }

  calculateTotalCost() {
    this.totalCost =
      Number(this.amount || 0) *
      Number(this.quantity || 0);
  }

  deleteRawMaterial(id: string) {
    this.rawMaterialService
      .deleteRawMaterial(id)
      .subscribe({
        next: (res: any) => {
          this.getAllRawMaterials();
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  editRawMaterial(rawMaterial: any) {
    this.isEditMode = true;
    this.editingRawMaterialId = rawMaterial._id;
    this.showAddRawMaterialPopup = true;
    this.rawMaterialName = rawMaterial.rawMaterialName;
    this.rawMaterialId = rawMaterial.rawMaterialId;
    this.quantity = rawMaterial.quantity;
    this.amount = rawMaterial.amount;
    this.supplierName = rawMaterial.supplierName;
    this.supplierId = rawMaterial.supplierId;
    this.totalCost = rawMaterial.totalCost;
    this.image = rawMaterial.image;
    this.stockStatus = rawMaterial.stockStatus;
  }

  updateExistingRawMaterial() {
    if (this.quantity <= this.lowStockLimit) {
      this.stockStatus = 'Low Stock';
    } else {
      this.stockStatus = 'In Stock';
    }

    const data = {
      rawMaterialName: this.rawMaterialName,
      rawMaterialId: this.rawMaterialId,
      quantity: this.quantity,
      amount: this.amount,
      supplierName: this.supplierName,
      supplierId: this.supplierId,
      totalCost: this.totalCost,
      image: this.image,
      stockStatus: this.stockStatus,
      inventoryHistory: [
        {
          action: 'Raw Material Updated',
          quantity: this.quantity
        }
      ],
    };

    this.rawMaterialService
      .updateRawMaterial(
        this.editingRawMaterialId,
        data
      )
      .subscribe({
        next: (res: any) => {
          this.showAddRawMaterialPopup = false;
          this.isEditMode = false;
          this.getAllRawMaterials();
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  toggleFilter(filter: string) {
    if (this.selectedFilters.includes(filter)) {
      this.selectedFilters = this.selectedFilters.filter(
        item => item !== filter
      );
    } else {
      this.selectedFilters.push(filter);
    }
  }

  searchRawMaterials() {
    const text = this.searchText.toLowerCase();

    if (this.selectedFilters.length === 0) {
      this.rawMaterialsList = this.allRawMaterials;
      return;
    }

    this.rawMaterialsList = this.allRawMaterials.filter(
      (rawMaterial: any) => {
        return this.selectedFilters.some(
          (filter: string) => {

            if (filter === 'Raw Material Name') {
              return rawMaterial.rawMaterialName
                ?.toLowerCase()
                .includes(text);
            }

            if (filter === 'Raw Material ID') {
              return rawMaterial.rawMaterialId
                ?.toLowerCase()
                .includes(text);
            }

            if (filter === 'Supplier Name') {
              return rawMaterial.supplierName
                ?.toLowerCase()
                .includes(text);
            }

            if (filter === 'Supplier ID') {
              return rawMaterial.supplierId
                ?.toLowerCase()
                .includes(text);
            }

            return false;
          }
        );
      }
    );
  }

  generateRawMaterialId() {

  if (!this.rawMaterialName) {

    return;

  }

  const prefix =

    this.rawMaterialName
      .substring(0, 3)
      .toUpperCase();

  const random =

    Math.floor(

      1000 + Math.random() * 9000

    );

  this.rawMaterialId =

    `RAW-${prefix}-${random}`;

}


generateSupplierId() {

  if (!this.supplierName) {

    return;

  }

  const prefix =

    this.supplierName
      .substring(0, 3)
      .toUpperCase();

  const random =

    Math.floor(

      1000 + Math.random() * 9000

    );

  this.supplierId =

    `SUP-${prefix}-${random}`;

}


  openHistory(rawMaterial: any) {
    console.log(rawMaterial);
    this.showAddRawMaterialPopup = false;

    this.selectedRawMaterialHistory =
      rawMaterial.inventoryHistory || [
        {
          action: 'No history available',
          quantity: rawMaterial.quantity,
          date: new Date()
        }
      ];

    this.showHistoryPopup = true;
  }

  @HostListener('document:click', ['$event'])
  closeSearchDropdown(event: any) {
    const clickedInside = event.target.closest('.search-box');
    if (!clickedInside) {
      this.showSearchFilters = false;
    }
  }
}