import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  private client!: Client;
  conectado: boolean = false;

  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];

  constructor() { }

  ngOnInit() {
    this.client = new Client();
    this.client.webSocketFactory = ()=>{
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.client.onConnect = (frame) => {
      console.log('Connectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = true;

      //We subscribe to the message broker, and then send a message to the server, which will be broadcasted to all clients subscribed to the same topic
      this.client.subscribe('/chat/mensaje', (e) => { 
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);
        this.mensajes.push(mensaje);
        console.log(mensaje);
      });

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

  enviarMensaje(): void {
    this.client.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.mensaje)
    });

    this.mensaje.texto = '';
  }
}
