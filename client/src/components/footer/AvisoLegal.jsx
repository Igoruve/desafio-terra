function AvisoLegal() {
  return (
    <section className="flex flex-col py-32 text-md max-w-1/2 mx-auto gap-8">
      <h3 className="text-2xl font-bold">LEGAL NOTICE</h3>

      <article>
        <h4 className="text-xl font-bold">Application Ownership</h4>
        <p>
          In compliance with the information duty set forth in Article 10 of
          Spanish Law 34/2002 of July 11 on Information Society Services and
          Electronic Commerce, please note that the Easy by Terra application
          (hereinafter, the “Application”) is owned by Terra, with its
          registered office at 228 Park Ave S, New York, NY 10003.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Contact</h4>
        <p>
          You may contact the owner by e-mail at:{" "}
          <a href="mailto:hello@terrahq.com">hello@terrahq.com</a>
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Terms of Use</h4>
        <p>
          Access to and use of this Application are subject to the following
          terms. Mere access or use implies full and unreserved acceptance of
          this Legal Notice.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">User Registration</h4>
        <p>
          To use the Application’s features (incident creation, tracking,
          reporting, access to metrics, etc.), you must register with an active
          user account. You agree to provide truthful information and keep it up
          to date.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Purpose of the Application</h4>
        <p>
          The Application allows users to report incidents, automatically
          classify them using Natural Language Processing (NLP) models, receive
          real-time notifications, and view related metrics. Easy by Terra is
          integrated with management platforms such as ClickUp to facilitate
          task creation and tracking.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Permitted Use</h4>
        <p>
          You agree to use the Application and its content lawfully and
          appropriately. Any use for illegal, fraudulent purposes, or in a way
          that could harm the reputation, interests, or rights of the owner or
          third parties is strictly prohibited.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Intellectual Property</h4>
        <p>
          All content, features, text, images, source code, design, and layout
          of the Application are the property of the owner or third parties who
          have authorized their use. Reproduction, distribution, or modification
          without express consent is prohibited.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Data Protection</h4>
        <p>
          Personal data collected through the Application will be processed in
          accordance with applicable data protection laws (EU Regulation
          2016/679 and Spanish Organic Law 3/2018). For more information, please
          consult our Privacy Policy.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Liability</h4>
        <p>
          The owner shall not be liable for any damages or losses arising from
          misuse of the Application, nor for decisions made by users based on
          information provided by the system (such as incident predictions or
          anomaly alerts).
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Changes</h4>
        <p>
          The owner reserves the right to modify at any time and without prior
          notice the presentation, configuration, and content of the
          Application, as well as these terms.
        </p>
      </article>

      <article>
        <h4 className="text-xl font-bold">Applicable Law and Jurisdiction</h4>
        <p>
          This Legal Notice is governed by Spanish law. In the event of any
          dispute, the parties submit to the courts of the city of New York, NY
          10003 (228 Park Ave S), unless applicable law provides otherwise.
        </p>
      </article>
    </section>
  );
}

export default AvisoLegal;
