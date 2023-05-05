import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Label } from 'src/app/shared/models/label.model';
import { LabelService } from 'src/app/shared/services/label.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-add-label-dialog',
  templateUrl: './add-label-dialog.component.html',
  styleUrls: ['./add-label-dialog.component.css'],
})
export class AddLabelDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddLabelDialogComponent>,
    private labelService: LabelService,
    @Inject(MAT_DIALOG_DATA) public data: Label
  ) {}

  selectedColor: ThemePalette;
  public color: ThemePalette = 'primary';
  message: string = '';

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const regex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i;
    if (this.data.name == '') {
      this.message = 'please fill in the name input';
      return;
    }
    if (!regex.test(this.selectedColor + '')) {
      this.message = 'please fill in the color input';
      return;
    }
    this.labelService
      .addlabel({
        name: this.data.name.toUpperCase(),
        color: this.selectedColor + '',
      })
      .subscribe((r) => {
        setTimeout(() => {
          this.dialogRef.close('refresh');
        }, 600);
      });
  }
}
