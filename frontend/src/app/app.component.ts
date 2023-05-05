import { Component, HostListener, OnInit } from '@angular/core';
import { LabelService } from './shared/services/label.service';
import { Label } from './shared/models/label.model';
import { MatDialog } from '@angular/material/dialog';
import { AddLabelDialogComponent } from './components/add-label-dialog/add-label-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  labels: Label[] = [];
  selectedLabel: Label | null = null;
  annotations: any[] = [];
  longText =
    'Bachelors degree in Computer Science or related field , or equivalent industry experience 5+ years of experience delivering solutions and support to enterprise customers +2 yars of experience managing and leading highly technical teams in a fast-paced environment . Demonstrated hands-on experience on one or more of the Dynamics 365 products e.g . Dynamics Customer Engagement (CRM) , Dynamics Finance Operations (ERP) & Preferred: MBA Understanding of cloud computing technologies is desired - Azure Core Platform ; Data Platform : SQL , Azure DB ; Application development & debugging experience: Power BI  PowerApps  Strong passion and focus on delivering the right customer experience Demonstrated ability to recruit  and develop global teams Ability to innovate and drive change Ability to build a deep technical relationship with internal teams and customers Microsoft Cloud Background Check: This position will be required to pass the Microsoft Cloud background check upon hire/transfer and every two years thereafter. Leave this section at the bottom:';
  selectedText: string = '';

  constructor(private labelService: LabelService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.labelService.getLabels().subscribe((r) => {
      this.labels = r as Label[];
    });
  }
  @HostListener('mousedown', ['$event'])
  onTextMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.selectedText = '';
    const selection = window.getSelection();
    if (selection !== null) {
      selection.removeAllRanges();
    }
  }

  @HostListener('mouseup', ['$event'])
  onTextMouseUp(event: MouseEvent) {
    event.stopPropagation();
    const selection = window.getSelection();
    if (selection !== null) {
      this.selectedText = selection.toString();
      if (this.selectedText !== '' && this.selectedLabel !== null)
        this.annotateText();
    }
  }

  annotateText() {
    const start = this.longText.indexOf(this.selectedText);
    const end = start + this.selectedText.length;
    const annotation = {
      start,
      end,
      label: this.selectedLabel?.name,
      text: this.selectedText,
    };

    // Check if the selected text overlaps with any existing annotations
    const overlappingAnnotation = this.annotations.find(
      (a) => a.start < end && a.end > start
    );
    if (overlappingAnnotation) {
      // exit from the function if there is an overlap
      return;
    }
    // push the annotation that we select
    this.annotations.push(annotation);

    // Highlight the selected text
    const selection = window.getSelection();
    if (selection !== null) {
      const range = selection.getRangeAt(0);
      //create a div for the selected sentence and customizing it
      const highlightSpan = document.createElement('div');
      // highlightSpan.classList.add('highlighted-sentence')
      highlightSpan.style.display = 'inline-block';
      highlightSpan.style.height = '25px';
      highlightSpan.style.borderRadius = '5px';
      highlightSpan.style.paddingTop = '3px';
      highlightSpan.style.backgroundColor =
        this.selectedLabel?.color ?? 'transparent';
      highlightSpan.style.color = 'white';
      highlightSpan.appendChild(range.extractContents());
      range.insertNode(highlightSpan);
      selection.removeAllRanges();
      // Add a new chip at the end of the selection
      const chipList = document.createElement('mat-chip-list');
      const chip = document.createElement('mat-chip') as any;
      chipList.appendChild(chip);
      highlightSpan.appendChild(chipList);

      // Set the chip text and color and styles
      chip.textContent = '    ' + this.selectedLabel?.name + '    ';
      chip.style.display = 'inline-block';
      chip.style.marginRight = '5px';
      chip.style.marginLeft = '5px';
      chip.style.height = '20px';
      chip.style.borderRadius = '5px';
      chip.style.backgroundColor = 'white';
      chip.style.color = 'black';
    }
    // set the selection to null
    this.selectedText = '';
    this.selectedLabel = null;
  }

  export() {
    const data = {
      document: this.longText,
      annotation: this.annotations,
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a') as HTMLAnchorElement;
    a.href = url;
    a.download = 'annotations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  addLabelDialog() {
    const dialog = this.dialog.open(AddLabelDialogComponent, {
      panelClass: 'my-dialog-class',
      width: '500px',
      data: { name: '', color: '#000000' },
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.labelService.getLabels().subscribe((r) => {
          this.labels = r as Label[];
        });
      }
    });
  }
}
