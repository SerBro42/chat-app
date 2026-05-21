import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  private client!: Client;
  conectado: boolean = false;

  constructor() { }

  ngOnInit() {
    this.client = new Client();
    this.client.webSocketFactory = ()=>{
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.client.onConnect = (frame) => {
      console.log('Connectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = true;
    }

    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + ' : ' + frame);
      this.conectado = false;
    }
    
  }

  conectar(): void {
    this.client.activate();
  }

  desconectar(): void {
    this.client.deactivate();
  }
}
