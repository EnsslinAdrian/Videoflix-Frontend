
# 🎬 VideoflixFrontend

Willkommen bei **Videoflix** — einem modernen Streaming-Frontend im Stil von Netflix.

Dieses Projekt wurde von **Adrian Enßlin** entwickelt und basiert auf **Angular CLI 19.2.9**.

Mit Videoflix kannst du Filme streamen, dich registrieren, anmelden und Passwörter zurücksetzen. Die Wiedergabe erfolgt über den modernen Plyr-Player mit HLS-Unterstützung.

---

## 🚀 Features

✅ Registrierung und Login  
✅ Passwort zurücksetzen und E-Mail-Verifizierung  
✅ JWT-Authentifizierung mit Token-Refresh  
✅ HLS Video-Streaming über Plyr  
✅ Trailer-Anzeige  
✅ Responsives, eigenes UI-Design (kein Bootstrap)  
✅ REST-API-Anbindung mit zentralem URL-Service  
✅ Modaler Dialog für Filminfos  
✅ Guards zum Schutz privater Bereiche

---

## 🧰 Technologien

- **Angular CLI**: 19.2.9
- **TypeScript**: ^5.x
- **RxJS**
- **Plyr** (mit HLS)
- **REST API**: https://api.adrianensslin.de

---

## 🗂 Projektstruktur

```bash
├───public
│   ├───fonts
│   └───img
│       ├───background
│       ├───icons
│       │   ├───arrows
│       │   └───sign_up
│       ├───logo
│       └───sound
└───src
    ├───app
    │   ├───auth
    │   │   ├───email-verify
    │   │   ├───forget-password
    │   │   ├───login
    │   │   ├───new-password
    │   │   └───sign-up
    │   ├───dialog
    │   │   └───movie-info
    │   ├───imprint
    │   │   ├───data-protection
    │   │   └───imprint
    │   ├───main-content
    │   │   ├───homepage
    │   │   ├───movie
    │   │   └───startsite
    │   ├───shared
    │   │   ├───footer
    │   │   └───header
    │   └───ui-component
    │       ├───error-toast
    │       └───typography
    ├───guards
    ├───interfaces
    ├───services
    │   ├───authentication
    │   ├───interceptor
    │   ├───movies
    │   └───urls
    └───validators
```

---

## 🔗 API-Base & URL-Service

**Base URL**: `https://api.adrianensslin.de/`

Der `UrlsService` kapselt alle Endpunkte:

```typescript
// Base URLs
baseUrl = 'https://api.adrianensslin.de/'
baseAuthUrl = 'https://api.adrianensslin.de/api/auth/'

// Authentication URLs
registerUrl = baseAuthUrl + 'register/'
loginUrl = baseAuthUrl + 'login/'
passwordResetUrl = baseAuthUrl + 'password-reset/'
passwordResetConfirmUrl = baseAuthUrl + 'password-reset/confirm/'
logoutUrl = baseAuthUrl + 'logout/'
meUrl = baseAuthUrl + 'me/'
emailVerifyUrl = baseAuthUrl + 'verify-email/'
authStatusUrl = baseAuthUrl + 'status/'
refreshUrl = baseAuthUrl + 'refresh/'

// Movie URLs
moviesUrl = baseUrl + 'api/movie/'
trailer = baseUrl + 'media/trailer/spingVideo_web_jSukF3F.mp4'
trailerCover = baseUrl + 'media/trailer/spring_0brOkmO.png'
```

---

## 🔥 Entwicklung

### Development-Server starten

```bash
ng serve
```

Gehe zu: [http://localhost:4200](http://localhost:4200)

### Build

```bash
ng build
```

Build-Artefakte werden im `dist/` Verzeichnis abgelegt.

---

## 🧪 Tests

### Unit Tests

```bash
ng test
```

### End-to-End Tests

```bash
ng e2e
```

> Hinweis: Für e2e-Tests muss ein passendes Framework integriert werden.

---

## 👤 Entwickler

**Adrian Enßlin**  
Fullstack-Entwickler | Angular | REST APIs | Video-Streaming

---

## 📢 Hinweis

Dieses Projekt dient als privates Streaming-Frontend für Lern- und Demonstrationszwecke.  
Alle Medien und Ressourcen sind nur Beispielinhalte.
