# Odesilani protokolu e-mailem

Tlacitko `Poslat na mail` ve strance vola Firebase Function `sendProtocolMail`.
Stranka se nejdriv zepta na cilovy e-mail a funkce odesle Word protokol pouze
na zadanou adresu.

## Dulezite omezeni Firebase

Firebase nema vlastni SMTP server. Pro tiche odeslani e-mailu bez vyskakovaciho
okna musi byt nasazena Cloud Function a ta musi mit nastavene SMTP udaje.

Projekt musi byt na tarifu **Blaze (pay-as-you-go)**, jinak Firebase nedovoli
zapnout Secret Manager ani nasadit funkci se secrets:

https://console.firebase.google.com/project/astip---servis/usage/details

## Nastaveni SMTP pristupu

V projektu Firebase je potreba jednorazove nastavit secrets:

```sh
firebase functions:secrets:set SMTP_HOST
firebase functions:secrets:set SMTP_PORT
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
```

Typicke hodnoty:

- `SMTP_HOST`: adresa SMTP serveru
- `SMTP_PORT`: `587` nebo `465`
- `SMTP_USER`: e-mail/adresa odesilatele
- `SMTP_PASS`: heslo nebo app password pro SMTP

## Nasazeni

```sh
firebase deploy --only functions:sendProtocolMail
```

Po nasazeni uz tlacitko nic nestahuje a neotevira mailove okno. Protokol se vygeneruje v prohlizeci, posle se do Firebase Function a ta ho odesle jako prilohu.
