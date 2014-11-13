Miniprojekt Server mit nodejs + angularjs: Reddit Clone
========

Zu programmieren ist ein Reddit Clone (http://www.reddit.com). Reddit ist eine Social News Website, bei welcher Benutzer Inhalte in Form von Links und Text (sog. „Self Posts“) publizieren können. Thematisch ist Reddit in Subreddits unterteilt. Wir verzichten in diesem Miniprojekt der Einfachheit halber sowohl auf Self Posts wie auch auf Subreddits. Links können aber kommentiert und „gevotet“ werden

Requirements
-------
1. Client muss mit JavaScript entwickelt werden
2. UI-Framework muss verwendet werden (BootStrap, jQuery Mobile)
3. Der Einsatz von einem Template Framework ist zwingend (z.B. doT.js, _underscore,... http://garann.github.io/template-chooser/)
4. Die Lösung kann eine Single Page sein.
5. Hierarchische Kommentare müssen nicht unterstützt sein.
6. Sortierung der Linkliste einfach beim Aufruf, kein dynamisches Umsortiere

Server
-------
Leichte Modifikationen am Server vorgenommen:
- Error-States werden mit HTTP-Status code im Response angzeigt (403 für Unauthorized, 400 für Validation fehler)
- socket.io emits genauer gemacht (anhand simpler namespacing)
- Korrektur einige Routes
- Anpassung an REST-Style Resultate
- Wildcard für direkte Client-Aufrufe (deeplinking)

Dependencies
-------
**UI**
- bootstrap http://getbootstrap.com/
- material theme for bootstrap http://fezvrasta.github.io/bootstrap-material-design/


**JS**
- angular https://angularjs.org/
- angular-relative-date https://github.com/wildlyinaccurate/angular-relative-date
- jquery https://www.jquery.com
- snackbarjs http://fezvrasta.github.io/snackbarjs/
