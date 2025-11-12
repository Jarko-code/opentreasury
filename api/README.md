# supplier-registry-model

Model pro Registr dodavatelu nad OpenPlatform.

### Postup pridani nove tridy do modelu

```
1. Vytvorit novou classu v adresari ./src/model
2. Re-exportnu classu v soubory ./src/model/OpenTreasuryServiceApi.ts
3. Zajistim spusteni scriptu "run-init-model" - nejlepe rucne, ale v budoucnu klidne pipelinou
```

### Popis package scriptu

```
"1-run-migrate-users" - spusti migraci uzivatelu, kteri jeste nejsou vytvoreni, pred timto je asi lepsi uzivatele promazat v db?
"2-run-create-update-model" - vytvori nebo updatne model v db,
"3-run-convert-operations" - prevede operace ze stare DB na open-objecty dle vytvoreneho modelu,
    
    
"install-new-op-api" - nainstaluje novou verzi API
lint a prettier srovna kod
"build": "tsc" - pro pipelinu
```

Puvodni model ma 57 definic trid + OLD_AGR === 58;

Proto cela model mapa ma 58 radku. 

A cely novy model ma 59 trid (Vcetne mappovani starych ID na nova URN)

jasny

### Process imports

1. smazat sms - tokeny = 1461 kusu
2. TOTO udela scritp, jinak to nejde  (leda updateDB a to se mi nechce) je treba smazat reference na mrtve operace => nekde je na ne reference, ale jsou smazany... soubor problems.ts obsahuje pole idecek
3. mrtvou operaci poznam tak ze ulozeni open objectu chodi ze misto urn posilam ID a toto ID nelze najit v DB. Potom dle co se zrovna ukladalo nbajdu z te dane reference vsechny ostatni
4. SMAZAT- RAT-VAL co maji spatny ratingItem (sedm jich je!)
 - vyjet si vsechny RAT-ITEM, vzit jejich ID a udelat query  'content.values.ratingItem': $nin [poleID jako string] 


### TODO
- [ ]  SMS tokeny, zahazuju! a je treba vyresit logiku vazby supplier!!!!!
- [ ]  vazby na user (tdi) 
- [ ]  jeste kde jsou nejaky vazby

## jmena konvence

Technicka kvalifikace = REFERENCE
Profesni kvalifikace == QualificationRequirement => Competence
