// Symfony CRUD — alle codes en commands in volgorde


// Kopieer blok voor blok. Vervang Smartphone, Vendor, oefen en eventuele poortnummers als je toets andere namen gebruikt. Deze handleiding gaat uit van Symfony + Doctrine + MySQL/MariaDB.

// 1. Symfony-project en database
// Maak een Symfony Web-project in PhpStorm. Maak database oefen in phpMyAdmin.

// Terminal (in de projectmap)
// composer install
// .env — vervang de actieve DATABASE_URL-regel
// DATABASE_URL="mysql://root:@127.0.0.1:3306/oefen?serverVersion=10.4.32-MariaDB&charset=utf8mb4"
// De versie 10.4.32-MariaDB is een voorbeeld. Gebruik je eigen MariaDB-versie en inloggegevens indien anders.

// Terminal — test verbinding
// php bin/console doctrine:query:sql "SELECT 1"
// 2. Smartphone entity — terminal
// php bin/console make:entity Smartphone
// Voer achtereenvolgens deze velden in (als UX Turbo wordt gevraagd: no):
// Property	Field type	Extra	Nullable
// type	string	length 255	no
// memory	integer	—	no
// color	string	length 255	no
// description	string	length 255	no
// picture	string	length 255	no
// price	decimal	precision 7, scale 2	no


// Druk Enter bij een lege propertynaam om te stoppen.
// 3. Vendor entity — terminal
// php bin/console make:entity Vendor
// Property name → string → 255 → nullable no. Daarna Enter bij lege propertynaam.
// 4. Relatie — terminal
// php bin/console make:entity Smartphone
// Antwoorden in volgorde:
// Vraag	Antwoord
// New property	vendor
// Field type	relation
// Related entity	Vendor
// Relationship	ManyToOne
// Nullable	no
// Add inverse property to Vendor	yes
// Field in Vendor	smartphones
// orphanRemoval	yes (zoals in oefenvideo)


// Daarna Enter bij lege propertynaam.
// 5. Migrations — terminal
// php bin/console make:migration
// php bin/console doctrine:migrations:migrate
// Bevestig met yes als daarom wordt gevraagd.
// 6. Vendor-data — phpMyAdmin → database oefen → SQL
// INSERT INTO vendor (name) VALUES ('Samsung'), ('Apple');
// 7. Controller en formulier genereren — terminal
// php bin/console make:controller SmartphoneController
// php bin/console make:form SmartphoneType Smartphone
// Bij PHPUnit-vraag: no.
// 8. src/Form/SmartphoneType.php — volledige inhoud
// <?php

// namespace App\Form;

// use App\Entity\Smartphone;
// use App\Entity\Vendor;
// use Symfony\Bridge\Doctrine\Form\Type\EntityType;
// use Symfony\Component\Form\AbstractType;
// use Symfony\Component\Form\Extension\Core\Type\SubmitType;
// use Symfony\Component\Form\FormBuilderInterface;
// use Symfony\Component\OptionsResolver\OptionsResolver;

// class SmartphoneType extends AbstractType
// {
//     public function buildForm(FormBuilderInterface $builder, array $options): void
//     {
//         $builder
//             ->add('type')
//             ->add('memory')
//             ->add('color')
//             ->add('description')
//             ->add('picture')
//             ->add('price')
//             ->add('vendor', EntityType::class, [
//                 'class' => Vendor::class,
//                 'choice_label' => 'name',
//             ])
//             ->add('save', SubmitType::class, [
//                 'label' => 'Save',
//             ]);
//     }

//     public function configureOptions(OptionsResolver $resolver): void
//     {
//         $resolver->setDefaults([
//             'data_class' => Smartphone::class,
//         ]);
//     }
// }
// 9. src/Controller/SmartphoneController.php — volledige inhoud (READ / VIEW / CREATE / UPDATE / DELETE)
// <?php

// namespace App\Controller;

// use App\Entity\Smartphone;
// use App\Form\SmartphoneType;
// use App\Repository\SmartphoneRepository;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\Routing\Attribute\Route;

// final class SmartphoneController extends AbstractController
// {
//     #[Route('/smartphone', name: 'app_smartphone')]
//     public function index(SmartphoneRepository $smartphoneRepository): Response
//     {
//         $smartphones = $smartphoneRepository->findAll();

//         return $this->render('smartphone/index.html.twig', [
//             'smartphones' => $smartphones,
//         ]);
//     }

//     #[Route('/smartphone/view/{id}', name: 'app_view_smartphone')]
//     public function view(int $id, SmartphoneRepository $smartphoneRepository): Response
//     {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         return $this->render('smartphone/view.html.twig', [
//             'smartphone' => $smartphone,
//         ]);
//     }

//     #[Route('/smartphone-add', name: 'app_smartphone_add')]
//     public function add(Request $request, EntityManagerInterface $entityManager): Response
//     {
//         $smartphone = new Smartphone();
//         $form = $this->createForm(SmartphoneType::class, $smartphone);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $entityManager->persist($smartphone);
//             $entityManager->flush();

//             $this->addFlash('success', 'Smartphone toegevoegd!');
//             return $this->redirectToRoute('app_smartphone');
//         }

//         return $this->render('smartphone/add.html.twig', [
//             'form' => $form->createView(),
//         ]);
//     }

//     #[Route('/smartphone/update/{id}', name: 'app_update_smartphone')]
//     public function update(
//         int $id,
//         Request $request,
//         SmartphoneRepository $smartphoneRepository,
//         EntityManagerInterface $entityManager
//     ): Response {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         $form = $this->createForm(SmartphoneType::class, $smartphone);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $entityManager->flush();
//             $this->addFlash('success', 'Smartphone aangepast!');
//             return $this->redirectToRoute('app_smartphone');
//         }

//         return $this->render('smartphone/update.html.twig', [
//             'form' => $form->createView(),
//         ]);
//     }

//     #[Route('/smartphone/delete/{id}', name: 'app_delete_smartphone', methods: ['POST'])]
//     public function delete(
//         int $id,
//         Request $request,
//         SmartphoneRepository $smartphoneRepository,
//         EntityManagerInterface $entityManager
//     ): Response {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         if (!$this->isCsrfTokenValid(
//             'delete' . $smartphone->getId(),
//             $request->getPayload()->getString('_token')
//         )) {
//             throw $this->createAccessDeniedException('Ongeldige token');
//         }

//         $entityManager->remove($smartphone);
//         $entityManager->flush();

//         $this->addFlash('danger', 'Smartphone verwijderd!');
//         return $this->redirectToRoute('app_smartphone');
//     }
// }
// 10. templates/smartphone/index.html.twig — volledig overzicht
// {% extends 'base.html.twig' %}

// {% block title %}Smartphones{% endblock %}

// {% block body %}
//     <h1>Smartphones</h1>

//     {% for label, messages in app.flashes %}
//         {% for message in messages %}
//             <p>{{ message }}</p>
//         {% endfor %}
//     {% endfor %}

//     <table border="1">
//         <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Vendor</th>
//                 <th>Type</th>
//                 <th>Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {% for smartphone in smartphones %}
//                 <tr>
//                     <td>{{ smartphone.id }}</td>
//                     <td>{{ smartphone.vendor.name }}</td>
//                     <td>{{ smartphone.type }}</td>
//                     <td>
//                         <a href="{{ path('app_view_smartphone', {id: smartphone.id}) }}">View</a>
//                         <a href="{{ path('app_update_smartphone', {id: smartphone.id}) }}">Update</a>
//                         <form method="post" action="{{ path('app_delete_smartphone', {id: smartphone.id}) }}" style="display:inline">
//                             <input type="hidden" name="_token" value="{{ csrf_token('delete' ~ smartphone.id) }}">
//                             <button type="submit">Delete</button>
//                         </form>
//                     </td>
//                 </tr>
//             {% else %}
//                 <tr><td colspan="4">Nog geen smartphones gevonden.</td></tr>
//             {% endfor %}
//         </tbody>
//     </table>

//     <br>
//     <a href="{{ path('app_smartphone_add') }}">Add Smartphone</a>
// {% endblock %}
// 11. templates/smartphone/view.html.twig — detailpagina (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone bekijken{% endblock %}

// {% block body %}
//     <h1>{{ smartphone.type }}</h1>

//     <table border="1">
//         <tr><th>ID</th><td>{{ smartphone.id }}</td></tr>
//         <tr><th>Vendor</th><td>{{ smartphone.vendor.name }}</td></tr>
//         <tr><th>Type</th><td>{{ smartphone.type }}</td></tr>
//         <tr><th>Memory</th><td>{{ smartphone.memory }}</td></tr>
//         <tr><th>Color</th><td>{{ smartphone.color }}</td></tr>
//         <tr><th>Description</th><td>{{ smartphone.description }}</td></tr>
//         <tr><th>Picture</th><td>{{ smartphone.picture }}</td></tr>
//         <tr><th>Price</th><td>{{ smartphone.price }}</td></tr>
//     </table>

//     <br>
//     <a href="{{ path('app_smartphone') }}">Go Back</a>
// {% endblock %}
// 12. templates/smartphone/add.html.twig — toevoegen (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone toevoegen{% endblock %}

// {% block body %}
//     <h1>Smartphone toevoegen</h1>
//     {{ form(form) }}
//     <br>
//     <a href="{{ path('app_smartphone') }}">Terug naar overzicht</a>
// {% endblock %}
// 13. templates/smartphone/update.html.twig — aanpassen (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone aanpassen{% endblock %}

// {% block body %}
//     <h1>Smartphone aanpassen</h1>
//     {{ form(form) }}
//     <br>
//     <a href="{{ path('app_smartphone') }}">Terug naar overzicht</a>
// {% endblock %}
// 14. Server starten en routes controleren — terminal
// symfony serve
// Open een tweede terminal voor:
// php bin/console debug:router
// Open het adres en de poort die je server zelf toont, met /smartphone erachter (bijvoorbeeld http://127.0.0.1:8002/smartphone).
// 15. Testen — formulier Add Smartphone
// Veld	Waarde
// Type	Galaxy S24
// Memory	256
// Color	Black
// Description	Samsung smartphone
// Picture	galaxy.png
// Price	799.99
// Vendor	Samsung


// Save → View → Update → Delete testen.
// 16. GitHub — terminal (optioneel)
// Maak eerst een lege repository via https://github.com/new. Gebruik bij voorkeur geen automatisch aangemaakt README als je deze bestaande projectmap pusht.
// git init
// git add .
// git commit -m "Symfony CRUD compleet"
// git branch -M main
// git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/JOUW-REPOSITORY.git
// git push -u origin main
// Vervang de repository-URL. Controleer vóór git add . dat .env.local, wachtwoorden en andere geheime bestande


// ls Toont bestanden en mappen in de huidige map.
// ls /etc/ppp Toont de inhoud van de opgegeven map
// /etc/ppp.
// ls /etc/ppp /etc/ssh Toont de inhoud van twee opgegeven mappen.
// ls -l Lange lijst: o.a. rechten, grootte en datum.
// ls -r Toont resultaten in omgekeerde alfabetische
// volgorde.
// ls -l -r / ls -rl / ls -lr Drie schrijfwijzen met hetzelfde effect: lange
// lijst in omgekeerde volgorde.
// ls -l /usr/bin/perl Toont o.a. de bestandsgrootte in bytes.
// ls -lh /usr/bin/perl Toont de grootte leesbaar in K, M of G.
// ls -l --human-readable /usr/bin/perl Lange schrijfwijze van -h; hetzelfde effect.
// 3.3.3 History (eerder getypte commando’s) (p. 6-8)

// history Laat eerder gebruikte commando’s zien.
// history 5 Toont de laatste vijf commando’s (het getal
// mag anders zijn).
// !2 Voert het commando met geschiedenisnummer
// 2 opnieuw uit.
// !-3 Herhaalt het commando van drie opdrachten
// terug.
// !! Herhaalt precies het laatst uitgevoerde
// commando.
// !ls Herhaalt het meest recente commando dat met
// ls begint.

// echo $HISTSIZE Laat zien hoeveel commando’s Bash in de
// history bijhoudt.
// HISTSIZE=500 Stelt de historylimiet van de huidige shell in op
// 500; controleer met echo $HISTSIZE.

// type cd Controleert het type van cd; dit is een
// ingebouwd shellcommando.
// which ls Zoekt het uitvoerbare bestand van ls via PATH.
// which cal Zoekt de locatie van het kalenderprogramma
// cal.
// /bin/ls Voert ls uit via het volledige pad.
// type cal Geeft aan welk type commando cal is.
// type echo Laat zien dat echo een shell builtin kan zijn.
// which echo Zoekt de externe uitvoerbare versie van echo.
// type -a echo Toont alle gevonden definities van echo.

// alias mycal="cal 2019" Maakt mycal als korte naam voor cal 2019.

// mycal Voert de alias uit: toont de kalender van 2019

// my_report () {
// ls Documents
// date
// echo "Document directory report"
// }

// my_report Voert achter elkaar ls Documents, date en echo



// echo The car costs $100 Bash probeert $1 te vervangen; meestal krijg je
// “The car costs 00”.
// echo 'The car costs $100' Het dollarteken blijft gewone tekst: “The car
// costs $100”.

// echo "The service costs $1 and the path is $PATH" In dubbele quotes worden $1 en $PATH
// geïnterpreteerd.
// echo 'The service costs $1 and the path is $PATH' In enkele quotes blijven beide
// dollar-uitdrukkingen letterlijk.
// echo The service costs \$1 and the path is $PATH De \ beschermt alleen het dollarteken van
// $1; $PATH wordt wel ingevuld.

// date Toont de huidige systeemdatum en -tijd.
// echo Today is date Drukt het woord “date” letterlijk af.
// echo Today is `date` Voert date binnen echo uit; de datum wordt
// ingevuld


// cal 1 2030; cal 2 2030; cal 3 2030 Voert alle drie de kalendercommando’s na
// elkaar uit, ook als een eerder commando faalt.

// ls /etc/ppp Voorbeeld van een commando dat lukt als de
// map bestaat en bereikbaar is.
// ls /etc/junk Voorbeeld van een commando dat mislukt als
// deze map niet bestaat.
// ls /etc/ppp && echo success Bij succes van ls verschijnt “success”.
// ls /etc/junk && echo success Bij mislukking wordt echo success
// overgeslagen.


// ls /etc/ppp || echo failed Bij succes van ls wordt echo failed
// overgeslagen.
// ls /etc/junk || echo failed Bij mislukking wordt “failed” afgedrukt.
// Mini-overzicht: symbolen en opties
// -l uitgebreide lijst !! laatste commando opnieuw
// -r omgekeerde volgorde 'tekst' speciale tekens blijven letterlijk
// -h / --human-
// readable
// leesbare bestandsgrootte \ beschermt het volgende speciale teken
// $NAAM gebruik de waarde van een variabele `date` voert het binnenste commando uit
// ~ home-directory ; voer opdrachten allemaal na elkaar uit
// PATH locaties waar de shell commando’s
// zoekt
// && tweede opdracht alleen bij succes

// Main function of an OS?	To manage hardware and software resources.
// 2. What else does a modern OS do?	It provides a user interface, security, and networking.
// 3. Example of a single-purpose OS?	An operating system in a router.
// 4. What do all devices with an OS have in common?	They use an OS to manage hardware and run software.

// Section 2.1.1
// Vraag	Antwoord
// 1. Which OS is not based on UNIX or Linux?	Microsoft Windows.
// 2. What is macOS based on?	UNIX.
// 3. What is true about Linux?	Linux is open-source and can be freely modified and distributed under its license.
// 4. How do Linux administrators perform tasks?	Usually through the command-line interface (CLI).

// Pagina 2 – Software & Distributions
// Section 2.2.1
// Vraag	Antwoord
// 1. Desktop vs. server?	A desktop is for personal tasks; a server provides services to other computers.
// 2. What determines a computer's function?	Its intended purpose and the software it runs.
// 3. What is a maintenance cycle?	The period in which software receives updates, fixes, and support.

// Beta & Stable Software
// Vraag	Antwoord
// 1. When is software beta?	When it is still being tested before its stable release.
// 2. Why use beta software?	To try new features early.
// 3. Why do production servers use stable versions?	Because they are more reliable and thoroughly tested.
// 4. Open-source vs. proprietary?	Open-source code is available to inspect and modify; proprietary source code is generally restricted.
// 5. What is backward compatibility?	New software can still work with older systems, files, or applications.

// Section 2.4 – Linux Distributions
// Vraag	Antwoord
// 1. What is a Linux distribution?	An operating system built using the Linux kernel and additional software.
// 2. What happens during installation?	The installer sets up the operating system and necessary software.
// 3. Purpose of a package manager?	To install, update, and remove software.
// 4. Why is choosing a distribution difficult?	Because many distributions exist for different needs.

// Pagina 3 – Linux in Practice
// Section 2.4 (continued)
// Vraag	Antwoord
// 5. What makes Linux special?	It is open-source, flexible, and highly customizable.

// Section 2.3
// Vraag	Antwoord
// 1. Why choose commercial Linux distributions?	For professional support, security updates, and reliability.
// 2. What helps ensure open-source security?	Community code reviews, security fixes, and regular updates.
// 3. Why do vendors support limited distributions?	To reduce testing and support costs.
// 4. Enthusiast vs. enterprise distribution?	Enthusiast distributions focus on new features; enterprise distributions prioritize stability and support.

// Section 2.4 – Linux Applications
// Vraag	Antwoord
// 1. Linux on desktops and laptops	The PDF only gives this heading; the actual question is missing.
// 2. What is Chrome OS based on?	Linux.
// 3. Why do developers prefer Linux?	Because it offers flexibility, powerful tools, and control.
// 4. Advantage in embedded systems?	Linux can run efficiently on different hardware.
// 5. Which mobile OS is Linux-based?	Android.
// 6. Other Linux-based mobile OS?	Tizen, Sailfish OS, and Ubuntu Touch.
// 7. Percentage of top 500 supercomputers using Linux?	100%.
// 8. Which cloud companies use Linux?	Amazon AWS, Google Cloud, and Microsoft Azure.

// Pagina 4 – Embedded Systems
// Section 2.4.2
// Vraag	Antwoord
// 1. Why could Linux support more hardware?	Its open-source code allowed developers to adapt it to different hardware architectures.
// 2. What is an embedded system?	A computer designed to perform a specific function inside another device.
// 3. How does embedded Linux affect IoT?	It enables many low-cost devices to connect to networks and exchange data.