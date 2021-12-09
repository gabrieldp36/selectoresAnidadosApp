import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaisesService } from '../../services/paises.service';

import { Region, PaisSmall, Pais } from '../../interfaces/paises.interfaces';

import { of, switchMap } from 'rxjs';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit  {

  public miFormulario: FormGroup = this.formBuilder.group({

    region: ['', [Validators.required] ],

    pais: ['', [Validators.required] ],

    frontera: ['', [Validators.required] ],
  });

  public regiones: Region[] = [];

  public paises: PaisSmall[] = [];

  public pais!: Pais | null;

  public fronteras!: PaisSmall[] | [];

  public cargando: boolean = false;

  public cargandoFrontera: boolean = false;

  constructor(
    
    private formBuilder: FormBuilder,

    private paisesService: PaisesService,
    
  ) {};

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // Selector Region - Pais

    this.miFormulario.get('region')?.valueChanges
    .pipe( 

      tap( (_) => {
        
        this.miFormulario.get('pais')?.reset('');

        this.cargando = true;
      
      }),

      switchMap ( region => (region) ? this.paisesService.getPaisPorRegion(region) : of( [] ) ),
    )
    .subscribe ( paises => {
      
      this.paises = paises

      this.cargando = false;
    
    });

    // Selector Pais - Pais Fronterizo

    this.miFormulario.get('pais')?.valueChanges
    .pipe(

      tap( (_) => { 
        
        this.miFormulario.get('frontera')?.reset('');

        this.cargando = true

        this.pais = null;
      }),

      switchMap ( codigo => (codigo) ? this.paisesService.getPaisPorCodigo(codigo) : of( null ) ),

      tap( ( pais ) => {

        this.cargando = false
        
        this.pais = pais 

        this.cargandoFrontera = true
      
      }),

      switchMap ( pais => (pais?.borders) ? this.paisesService.getPaisesFronterizos(pais.borders) : of( [] ) ),

      
    )
    .subscribe ( paises => {
      
      this.fronteras = paises;

      this.cargandoFrontera = false;
    });
  };

  sinFrontera(): boolean {

    return (!this.pais?.borders && this.miFormulario.controls['pais']?.value) ? true : false;
  };

  guardar() {

    if(this.miFormulario.invalid) {

      return;
    };

    console.log('Formulario posteado');

    this.miFormulario.reset({

      region: '',
      pais: '',
      frontera: '',
    });
  };
};
