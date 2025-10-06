import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contacts = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/carlos-vitor-b3838436b/',
      icon: 'assets/img/linkedin.svg',
      alt: 'LinkedIn'
    },
    {
      name: 'Email',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=carlosvitosestudos@gmail.com&su=Contato%20via%20StickyStudy',
      icon: 'assets/img/gmail-logo.svg',
      alt: 'Email'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Carloscidral',
      icon: 'assets/img/github-logo.svg',
      alt: 'GitHub'
    }
  ];
}