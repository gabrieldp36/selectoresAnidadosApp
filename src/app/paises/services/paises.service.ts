import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable } from 'rxjs';

import { Region, PaisSmall, Pais } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: Region[] = [
    
    {continente: 'Africa', region:'Africa' },
    {continente: 'América', region:'Americas'},
    {continente: 'Asia', region:'Asia'},
    {continente: 'Europa', region:'Europe'},
    {continente: 'Oceanía', region:'Oceania'},
  ];

  private baseUrl: string = 'https://restcountries.com/v2'

  constructor(private http: HttpClient) {};

  get regiones(): Region[] {

    return [ ...this._regiones ];
  };

  getPaisPorRegion(region: string): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/region/${region}?fields=translations,alpha3Code`;

    return this.http.get<PaisSmall[]>(url);
  };

  getPaisPorCodigo(codigo: string): Observable<Pais> {

    const url: string = `${this.baseUrl}/alpha/${codigo}`;

    return this.http.get<Pais>(url);
  };

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {

    const url: string = `${this.baseUrl}/alpha/${codigo}`;

    return this.http.get<PaisSmall>(url);
  };

  getPaisesFronterizos(borders: string[]): Observable<PaisSmall[]> {

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {

      const peticion: Observable<PaisSmall> = this.getPaisPorCodigoSmall(codigo);

      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  };
};
